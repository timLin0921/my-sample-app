/* eslint-disable no-unused-vars */
const express = require('express');
const router = new express.Router();

const options = {
  swaggerDefinition: {
    info: {
      title: 'REST - Swagger',
      version: '1.0.0',
      description: 'REST API with Swagger doc',
      contact: {
        email: '',
      },
    },
    tags: [
      {
        name: 'AMSS5',
        description: 'AMSS5 API',
      },
    ],
    schemes: ['http', 'https'],
    host: 'localhost:3124',
    basePath: '/api',
  },
  apis: ['./routes/api.js'],
};

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = swaggerJSDoc(options);
require('swagger-model-validator')(swaggerSpec);

router.get('/json', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// eslint-disable-next-line require-jsdoc
function validateModel(name, model) {
  const responseValidation = swaggerSpec.validateModel(
    name,
    model,
    false,
    true,
  );
  if (!responseValidation.valid) {
    console.error(responseValidation.errors);
    throw new Error(`Model doesn't match Swagger contract`);
  }
}

module.exports = router;
