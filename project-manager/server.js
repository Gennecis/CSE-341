const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const indexRoute = require('./routes/index');
const projectsRoute = require('./routes/projects');
const tasksRoute = require('./routes/tasks');
const initDb = require('./database/connect');

const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/', indexRoute);
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
