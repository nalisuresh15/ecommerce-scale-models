const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (err) {
    console.error("❌ Auth error:", err.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

exports.admin = (req, res, next) => {
  if (req.user && req.user.email === process.env.ADMIN_EMAIL) {
    req.user.isAdmin = true;
    next();
  } else {
    return res.status(403).json({ message: "Admin access only" });
  }
};
