module.exports = {
    HOST: "localhost",
    USER: "leapchain",
    PASSWORD: "leap",
    DB: "leapchain",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
