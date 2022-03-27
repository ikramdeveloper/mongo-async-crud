const express = require("express");
const { handleNewUser } = require("../controllers/register.controller");
const router = express.Router();

router.post("/", handleNewUser);

module.exports = router;
