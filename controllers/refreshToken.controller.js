const jwt = require("jsonwebtoken");
const User = require("../models/User");

const handleRefreshToken = async (req, resp) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return resp.sendStatus(401);
  const refreshToken = cookies.jwt;

  const findUser = await User.findOne({ refreshToken }).exec();

  if (!findUser) return resp.sendStatus(403); // Forbidden

  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || findUser.username !== decoded.username)
      return resp.sendStatus(403);
    const roles = Object.values(findUser.roles);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: decoded.username,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );
    resp.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
