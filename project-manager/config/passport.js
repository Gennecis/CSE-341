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
    done(null, user._id.toString());
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const db = mongodb.getDb();
      const ObjectId = require('mongodb').ObjectId;
      const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
      done(null, user);
    } catch (error) {
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
          const db = mongodb.getDb();

          // Check if user already exists
          let user = await db.collection('users').findOne({ githubId: profile.id });

          if (user) {
            // Update last login
            await db.collection('users').updateOne(
              { githubId: profile.id },
              { $set: { lastLogin: new Date() } }
            );
          } else {
            // Create new user
            const newUser = createUserFromGitHub(profile);
            const result = await db.collection('users').insertOne(newUser);
            user = { _id: result.insertedId, ...newUser };
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
};

module.exports = configurePassport;
