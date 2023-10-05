export const swaggerOptions = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Storefront API',
      version: '1.0.0',
      description: 'An e-commerce API for a storefront',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['src/handlers/*.ts'],
};
