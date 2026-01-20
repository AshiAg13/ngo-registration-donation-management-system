import jwt from "jsonwebtoken";

/**
 * authMiddleware
 * Verifies the JWT from the Authorization header and attaches 
 * user identity to the request object.
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check if the header exists and follows "Bearer <token>" format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        message: "Access denied. No authentication token provided." 
      });
    }

    // 2. Extract the actual token string
    const token = authHeader.split(" ")[1];

    // 3. Verify the token using the secret key
    // Added a check to ensure JWT_SECRET is available in environment
    if (!process.env.JWT_SECRET) {
      console.error("Critical: JWT_SECRET is missing in environment variables.");
      return res.status(500).json({ message: "Internal authentication configuration error." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user data to the request (req) object
    // These will be used by the controllers and the Admin middleware
    req.userId = decoded.id;
    req.userRole = decoded.role;

    // 5. Move to the next function (Controller or next Middleware)
    next();
  } catch (error) {
    // Distinguish between expired tokens and invalid ones for better UX
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }
    
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ message: "Authentication failed. Invalid token." });
  }
};

export default authMiddleware;