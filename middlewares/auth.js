const jwt = require("jsonwebtoken");
const config = require("config");

let verificarToken = (req, res, next) => {
  let token = req.get("Authorization").replace("Bearer ", "");

  jwt.verify(token, config.get("configToken.SEED"), (err, decoded) => {
    if (err) {
      return res.status(401).json({ err });
    }
    // res.send(token);
    req.usuario = decoded.usuario;
    next();
  });
};

module.exports = verificarToken;
