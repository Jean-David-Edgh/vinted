const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  console.log(req.headers.authorization);
  if (req.headers.authorization) {
    const user = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", ""),
    });
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).json({ error: "Unauthorized 2" });
    }
    console.log(user);
  } else {
    res.status(401).json({ error: "Unauthorized 1" });
  }
};

module.exports = isAuthenticated;
