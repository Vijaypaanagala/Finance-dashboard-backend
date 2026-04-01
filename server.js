const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const healthRoutes = require("./routes/healthRoutes");
const userRoutes = require("./routes/userRoutes");
const recordRoutes = require("./routes/recordRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const errorHandler = require("./middleware/errorHandler");

// Environment setup: default to development and load .env only outside production.
const NODE_ENV = process.env.NODE_ENV || "development";
process.env.NODE_ENV = NODE_ENV;

if (NODE_ENV !== "production") {
  dotenv.config();
}

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.locals.baseUrl = BASE_URL;
app.locals.environment = NODE_ENV;

// Allow all origins for now; restrict origins in production if needed.
app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Running in ${NODE_ENV} mode`);
  console.log(`Server running on port ${PORT}`);
});
