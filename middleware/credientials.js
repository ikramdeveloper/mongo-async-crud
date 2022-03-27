const allowedOrigins = require("../config/allowed-origins");

const credientials = (req, resp, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    resp.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

module.exports = credientials;
