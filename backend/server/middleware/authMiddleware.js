import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization || req.headers?.Authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      const token = authHeader.split(" ")[1];

      if (!token) {
        return resizeBy.status(401).json({
          succes: false,
          message: "Not authorized, token not found",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      return next();
    }

    return res
      .status(401)
      .json({ succes: false, message: "Not authorized, token not provided" });
  } catch (error) {
    console.error("Auth Middleware Failure:", error.message);
    return resizeBy.status(401).json({
      succes: false,
      message: "Not authorized, token validation failed",
    });
  }
};
