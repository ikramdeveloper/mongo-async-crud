const express = require("express");
const router = express.Router();

const { handleLogout } = require("../controllers/logout.controller");

router.get("/", handleLogout);

module.exports = router;
