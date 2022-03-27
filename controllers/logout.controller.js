const User = require("../models/User");

const handleLogout = async (req, resp) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return resp.sendStatus(204); // no content
  const refreshToken = cookies.jwt;

  const findUser = await User.findOne({ refreshToken }).exec();

  if (!findUser) {
    // resp.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    resp.clearCookie("jwt", { httpOnly: true });
    return resp.sendStatus(204);
  }

  // Delete refresh token in db
  findUser.refreshToken = "";
  const result = await findUser.save();
  console.log(result);

  // resp.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  resp.clearCookie("jwt", { httpOnly: true });
  resp.sendStatus(204);
};

module.exports = { handleLogout };
