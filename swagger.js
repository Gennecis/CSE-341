const swaggerAutogen = require('swagger-autogen')();
require('dotenv').config();

// Determine the host based on environment
const host = process.env.SWAGGER_HOST || 'localhost:3000';
const isProduction = process.env.NODE_ENV === 'production';

const doc = {
  info: {
    title: 'Contacts API',
    description: 'API for managing contacts with CRUD operations',
    version: '1.0.0',
  },
  host: host,
  schemes: isProduction ? ['https'] : ['http', 'https'],
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server',
    },
    {
      url: 'https://cse-341-ravg.onrender.com',
      description: 'Production server',
    },
  ],
  tags: [
    {
      name: 'Contacts',
      description: 'Endpoints for managing contacts',
    },
  ],
  definitions: {
    Contact: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      favoriteColor: 'blue',
      birthday: '1990-01-01',
    },
    ContactResponse: {
      _id: '507f1f77bcf86cd799439011',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      favoriteColor: 'blue',
      birthday: '1990-01-01',
    },
    CreateResponse: {
      id: '507f1f77bcf86cd799439011',
    },
    Error: {
      message: 'Error description',
    },
    ValidationError: {
      message: 'Validation failed',
      errors: ['firstName is required', 'email is required'],
    },
  },
};

const outputFile = './swagger.json';
const routes = ['./server.js'];

// Generate swagger.json
swaggerAutogen(outputFile, routes, doc);
