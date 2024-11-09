const swaggerAutogen = require('swagger-autogen')();
const { exec } = require('child_process');

const doc = {
  info: {
    title: 'Smart Study Solutions API Documentation',
    
    description: 'API documentation for the Smart Study Solutions project. Below are the available endpoints organized by functionality.',
    version: '1.0.0',

  },
  schemes: ['http'],
  
};

const outputFile = './swagger-output.json';
const endpointsFiles = [
  './app.js' // Include the main app file which includes all routes
];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation has been generated.');
  exec('node backend/app.js', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error executing app.js: ${err}`);
      return;
    }
    console.log(stdout);
    console.error(stderr);
  });
});
