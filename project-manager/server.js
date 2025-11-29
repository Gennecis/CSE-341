const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const indexRoute = require('./routes/index');
const projectsRoute = require('./routes/projects');
const tasksRoute = require('./routes/tasks');
const authRoute = require('./routes/auth');
const initDb = require('./database/connect');
const configurePassport = require('./config/passport');

const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: true, // Allow requests from any origin (or configure specific origins)
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.CONNECTION_STRING,
      dbName: process.env.DB_NAME || 'ProjectManager',
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      httpOnly: true,
      sameSite: 'lax', // 'lax' allows cookies on OAuth redirects (same-site navigation)
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
configurePassport();

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/', indexRoute);
app.use('/auth', authRoute);
app.use('/projects', projectsRoute);
app.use('/tasks', tasksRoute);

// Initialize database and start server
initDb.initDb((err) => {
  if (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  } else {
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
      console.log(`API Documentation available at: http://localhost:${port}/api-docs`);
    });
  }
});
