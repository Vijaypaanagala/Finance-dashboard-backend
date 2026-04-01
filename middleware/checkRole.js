const checkRole = (allowedRoles = []) => {
  return (req, res, next) => {
    const headerRole = req.headers.role;
    const userRole = req.user?.role || headerRole;

    if (!userRole) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const normalizedRole = String(userRole).toLowerCase().trim();
    const normalizedAllowedRoles = allowedRoles.map((role) => String(role).toLowerCase().trim());

    if (!normalizedAllowedRoles.includes(normalizedRole)) {
      return res.status(403).json({ message: "Access denied" });
    }

    return next();
  };
};

module.exports = checkRole;
