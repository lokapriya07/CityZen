const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "4fc15b32c4014a3aacaa8123af7625ce";

// Protect middleware
const protect = async (req, res, next) => {
  let token;

  try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, JWT_SECRET);

      // Accept both payload styles
      const userId = decoded.id || (decoded.user && decoded.user.id);

      if (!userId) {
        return res.status(401).json({ success: false, message: "Not authorized, token missing user id" });
      }

      req.user = await User.findById(userId).select("-password");

      if (!req.user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }

      if (req.user.isActive === false) {
        return res.status(401).json({ success: false, message: "Account is deactivated" });
      }

      return next();
    }

    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  } catch (err) {
    console.error(" protect() — Token verification error:", err.message);
    return res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};

// Authorize middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    console.log("Authorize middleware:", {
      user: req.user && req.user.email,
      role: req.user && req.user.role,
      expected: roles,
    });
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "User role not authorized" });
    }
    next();
  };
};


module.exports = { protect, authorize };
