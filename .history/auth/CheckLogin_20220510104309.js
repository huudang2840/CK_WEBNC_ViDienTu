const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let authorization = req.header("Authorization");
  console.log(authorization);
  if (!authorization) {
    return res.status(401).json({ code: 101, message: "Vui lòng cung cấp jwt token qua header" });
  }
  let token = authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ code: 101, message: "Vui lòng cung cấp jwt token hợp lệ" });
  }
  const { JWT_SECRET } = process.env;
  if (!token) {
    return res.status(401).json({ code: 101, message: "Vui lòng cung cấp jwt token" });
  }
  jwt.verify(token, JWT_SECRET, (err, data) => {
    if (err) {
      return res.status(401).json({ code: 101, message: "Token không hợp lệ hoặc hết hạn" });
    }
    req.user = data;
    next();
  });
};
