const bcrypt = require("bcrypt");
const User = require("../models/User");

const handleNewUser = async (req, resp) => {
  const { username, pwd } = req.body;
  if (!username || !pwd) {
    return resp
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const findDuplicate = await User.findOne({ username }).exec();

  if (findDuplicate)
    return resp.status(409).json({ message: "Such user already exists" });

  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const result = await User.create({ username, password: hashedPwd });

    console.log(result);

    resp.status(200).json({ message: `User ${username} successfully created` });
  } catch (err) {
    resp.status(500).json({ err: err.message });
  }
};

module.exports = { handleNewUser };
