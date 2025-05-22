const jwt = require("jsonwebtoken")
const User = require("../models/User")

module.exports = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Pas de token, autorisation refusée" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    const userExists = await User.findById(decoded.id);
    if (!userExists) {
      return res.status(401).json({ message: "Token invalide, utilisateur non trouvé" });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalide" });
  }
};
