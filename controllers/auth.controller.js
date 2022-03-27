const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, resp) => {
  const { username, pwd } = req.body;
  if (!username || !pwd)
    return resp
      .status(400)
      .json({ message: "Username and password are required" });

  const findUser = await User.findOne({ username }).exec();

  if (!findUser) return resp.sendStatus(401);

  const matchPwd = await bcrypt.compare(pwd, findUser.password);
  if (matchPwd) {
    const roles = Object.values(findUser.roles);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: findUser.username,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    const refreshToken = jwt.sign(
      { username: findUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // saving refreshToken with user
    findUser.refreshToken = refreshToken;
    const result = await findUser.save();
    console.log(result);

    resp.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    // resp.cookie("jwt", refreshToken, {
    //   httpOnly: true,
    //   sameSite: "None",
    //   secure: true,
    //   maxAge: 24 * 60 * 60 * 1000,
    // });
    resp.status(200).json({ accessToken });
  } else {
    resp.sendStatus(401);
  }
};

module.exports = { handleLogin };
