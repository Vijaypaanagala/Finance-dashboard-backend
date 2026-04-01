const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const healthRoutes = require("./routes/healthRoutes");
const userRoutes = require("./routes/userRoutes");
const recordRoutes = require("./routes/recordRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
connectDB();

const app = express();

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
