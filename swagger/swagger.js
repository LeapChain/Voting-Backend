const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Leapchain Voting API",
    description: "API documentation of Leapchain.",
  },
  host: "",
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
  definitions: {
    authUser: {
      accountNumber:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      signature:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      message: {
        nonce: 123456,
      },
    },
    createUser: {
      accountNumber:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
    changeUsername: {
      username: "username",
    },
    Poll: {
      accountNumber:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      signature:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      message: {
        title: "Poll Title",
        description: "Poll Description",
        url: "https://www.example.com",
        nonce: 123456,
        choices: [{ title: "the title of the choice" }],
      },
    },
    pollVote: {
      accountNumber:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      signature:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      message: {
        choices: "id of the poll choice",
        nonce: 123456,
      },
    },
    userVote: {
      accountNumber:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      signature:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      message: {
        nonce: 123456,
      },
    },
  },
};

const outputFile = "./swagger/swagger.json";
const endpointsFiles = ["./index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
