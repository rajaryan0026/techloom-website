import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Techloom API',
      version: '1.0.0',
      description: 'Enterprise API for Techloom — Where Technology Meets Trust',
      contact: { name: 'Techloom', email: 'admin@techloom.com' },
    },
    servers: [{ url: '/api', description: 'API Server' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Public', description: 'Public marketing endpoints' },
      { name: 'User', description: 'Client dashboard endpoints' },
      { name: 'Admin', description: 'Admin panel endpoints' },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);