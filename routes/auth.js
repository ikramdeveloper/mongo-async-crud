const express = require("express");
const { handleLogin } = require("../controllers/auth.controller");
const router = express.Router();

router.post("/", handleLogin);

module.exports = router;
