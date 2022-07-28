const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Leapchain Voting API",
    description: "API documentation of Leapchain.",
  },
  schemes: ["http", "https"],
  securityDefinitions: {
    jwt: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
    },
  },
  security: [
    {
      jwt: [],
    },
  ],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
