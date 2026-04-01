const getHealth = (req, res) => {
  return res.status(200).json({
    status: "OK",
    environment: req.app.locals.environment || process.env.NODE_ENV || "development",
    baseUrl: req.app.locals.baseUrl,
  });
};

module.exports = { getHealth };
