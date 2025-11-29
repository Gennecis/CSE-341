const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Project Manager API',
    description: 'API for managing projects and tasks with full CRUD operations',
    version: '1.0.0',
  },
  host: 'cse-341-project-manager.onrender.com',
  schemes: ['https'],
  tags: [
    {
      name: 'Authentication',
      description: 'GitHub OAuth authentication endpoints',
    },
    {
      name: 'Projects',
      description: 'Endpoints for managing projects (POST/PUT/DELETE require authentication)',
    },
    {
      name: 'Tasks',
      description: 'Endpoints for managing tasks (POST/PUT/DELETE require authentication)',
    },
  ],
  securityDefinitions: {
    github: {
      type: 'oauth2',
      authorizationUrl: 'https://github.com/login/oauth/authorize',
      flow: 'implicit',
      scopes: {
        'user:email': 'Access user email',
      },
    },
  },
  definitions: {
    Project: {
      name: 'Website Redesign',
      description: 'Complete overhaul of company website',
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      status: 'active',
      budget: 50000,
      owner: 'John Doe',
      priority: 'high',
    },
    ProjectResponse: {
      _id: '507f1f77bcf86cd799439011',
      name: 'Website Redesign',
      description: 'Complete overhaul of company website',
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      status: 'active',
      budget: 50000,
      owner: 'John Doe',
      priority: 'high',
    },
    Task: {
      title: 'Design homepage mockup',
      description: 'Create initial design mockup for homepage',
      projectId: '507f1f77bcf86cd799439011',
      status: 'in-progress',
      dueDate: '2024-02-15',
      assignedTo: 'Jane Smith',
      priority: 'high',
    },
    TaskResponse: {
      _id: '507f1f77bcf86cd799439012',
      title: 'Design homepage mockup',
      description: 'Create initial design mockup for homepage',
      projectId: '507f1f77bcf86cd799439011',
      status: 'in-progress',
      dueDate: '2024-02-15',
      assignedTo: 'Jane Smith',
      priority: 'high',
    },
    CreateResponse: {
      id: '507f1f77bcf86cd799439011',
    },
    Error: {
      message: 'Error description',
    },
    ValidationError: {
      message: 'Validation failed',
      errors: ['Field is required', 'Invalid value'],
    },
    AuthError: {
      message: 'Authentication required',
      error: 'You must be logged in to access this resource',
      loginUrl: '/auth/github',
    },
    User: {
      id: '507f1f77bcf86cd799439011',
      githubId: '12345678',
      username: 'johndoe',
      displayName: 'John Doe',
      email: 'john.doe@example.com',
      avatarUrl: 'https://avatars.githubusercontent.com/u/12345678',
    },
  },
};

const outputFile = './swagger.json';
const routes = ['./server.js'];

// Generate swagger.json
swaggerAutogen(outputFile, routes, doc);
