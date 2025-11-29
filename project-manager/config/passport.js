const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { createUserFromGitHub } = require('../models/user');
const mongodb = require('../database/connect');

/**
 * Configure Passport with GitHub OAuth strategy
 */
const configurePassport = () => {
  // Serialize user to session
  passport.serializeUser((user, done) => {
    console.log('Serializing user:', user._id);
    done(null, user._id.toString());
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      console.log('Deserializing user ID:', id);
      const db = mongodb.getDb();
      const ObjectId = require('mongodb').ObjectId;
      const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
      console.log('User deserialized:', user ? user._id : 'not found');
      done(null, user);
    } catch (error) {
      console.error('Deserialize error:', error);
      done(error, null);
    }
  });

  // GitHub OAuth Strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL || 'http://localhost:3000/auth/github/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('GitHub OAuth callback triggered for user:', profile.id);
          const db = mongodb.getDb();

          if (!db) {
            console.error('Database connection not available');
            return done(new Error('Database connection failed'), null);
          }

          // Check if user already exists
          let user = await db.collection('users').findOne({ githubId: profile.id });

          if (user) {
            console.log('Existing user found:', user._id);
            // Update last login
            await db.collection('users').updateOne(
              { githubId: profile.id },
              { $set: { lastLogin: new Date() } }
            );
          } else {
            console.log('Creating new user for GitHub ID:', profile.id);
            // Create new user
            const newUser = createUserFromGitHub(profile);
            const result = await db.collection('users').insertOne(newUser);
            user = { _id: result.insertedId, ...newUser };
            console.log('New user created:', user._id);
          }

          console.log('User authentication successful, returning user');
          return done(null, user);
        } catch (error) {
          console.error('GitHub OAuth error:', error);
          return done(error, null);
        }
      }
    )
  );
};

module.exports = configurePassport;
