const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Server error";

  return res.status(statusCode).json({ message });
};

module.exports = errorHandler;
