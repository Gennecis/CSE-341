const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const indexRoute = require('./routes/index');
const contactsRoute = require('./routes/contacts');
const initDb = require('./database/connect');

const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation with dynamic host
const swaggerOptions = {
  swaggerOptions: {
    url: '/swagger.json',
  },
};

// Serve swagger.json with dynamic host
app.get('/swagger.json', (req, res) => {
  const updatedSwagger = { ...swaggerDocument };
  updatedSwagger.host = req.get('host');
  updatedSwagger.schemes = req.protocol === 'https' ? ['https'] : ['http', 'https'];
  res.json(updatedSwagger);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, swaggerOptions));

// Routes
app.use('/', indexRoute);
app.use('/contacts', contactsRoute);

initDb.initDb((err) => {
    if (err) {
      console.log(err);
    } else {
      app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
      });
    }
});