const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const healthRoutes = require("./routes/healthRoutes");
const userRoutes = require("./routes/userRoutes");
const recordRoutes = require("./routes/recordRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const errorHandler = require("./middleware/errorHandler");

// Default to development when NODE_ENV is not provided.
const NODE_ENV = process.env.NODE_ENV || "development";
process.env.NODE_ENV = NODE_ENV;

// Load .env only for local development.
if (NODE_ENV === "development") {
  require("dotenv").config();
}

connectDB();

const app = express();

// CORS policy: open in development, controlled in production.
const corsOptions =
  NODE_ENV === "production"
    ? { origin: process.env.CORS_ORIGIN || true }
    : { origin: true };

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // Detailed logs in development, concise logs in production.
  if (NODE_ENV === "development") {
    console.log(`[DEV] Server running on port ${PORT}`);
    console.log(`[DEV] Environment: ${NODE_ENV}`);
  } else {
    console.log(`Server started on port ${PORT}`);
  }
});
