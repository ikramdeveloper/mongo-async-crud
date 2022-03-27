const path = require("path");
const express = require("express");
const router = express.Router();

router.get("^/$|/index(.html)?", (req, resp) => {
  resp.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
