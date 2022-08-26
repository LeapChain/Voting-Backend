const express = require("express");
const router = express.Router();
const { scanTransaction } = require("../controllers/transaction");

router.post("/scan", scanTransaction);

module.exports = router;
