const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Use one connection variable for both local and production setups.
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(mongoUri);

    if (process.env.NODE_ENV === "development") {
      console.log("[DEV] MongoDB connected");
    } else {
      console.log("MongoDB connected");
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
