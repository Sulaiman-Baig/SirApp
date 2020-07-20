const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token,"very-long-string-for-secret");
    next();
  } catch(err) {
    res.status(401).json({message: 'Invalid token or token expired'});
  }
};
