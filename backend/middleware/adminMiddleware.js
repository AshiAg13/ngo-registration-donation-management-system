/**
 * adminMiddleware
 * Restricts access to routes based on the User Role.
 * MUST be placed after the verifyToken middleware in your routes.
 */
const adminMiddleware = (req, res, next) => {
  // Check if user object exists (attached by verifyToken)
  // Standardizing property name to 'userRole' as per your existing logic
  if (!req.userRole) {
    return res.status(401).json({ 
      message: "Authentication required. Role not identified." 
    });
  }

  if (req.userRole !== "ADMIN") {
    console.warn(`🛑 Access Denied: User ${req.userId} attempted to access Admin routes.`);
    return res.status(403).json({ 
      message: "Access Denied: Administrative privileges required." 
    });
  }

  // User is Admin, proceed to the controller
  next();
};

export default adminMiddleware;