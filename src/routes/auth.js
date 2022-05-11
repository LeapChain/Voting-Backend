const express = require("express");
const router = express.Router();
const { authUser } = require("../controllers/auth");

router.post("/", authUser);

module.exports = router;
