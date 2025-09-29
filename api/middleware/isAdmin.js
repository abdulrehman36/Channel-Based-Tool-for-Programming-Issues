// middleware/isAdmin.js
import jwt from "jsonwebtoken";

export const isAdmin = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    // Attach user info to the request so routes can access it if needed
    req.user = userInfo;

    // Check if username is 'admin' to authorize
    if (userInfo.username !== "admin") {
      return res.status(403).json("Access denied: Not an admin");
    }

    next();
  });
};
