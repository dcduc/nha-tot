import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(401, "Unauthorized: Token not provided"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(errorHandler(401, "Unauthorized: Token expired"));
      }
      return next(errorHandler(403, "Forbidden: Invalid token"));
    }

    req.user = decodedToken;
    next();
  });
};
