const getHealth = (req, res) => {
  res.status(200).json({
    status: "OK",
    environment: process.env.NODE_ENV || "development",
  });
};

module.exports = { getHealth };
