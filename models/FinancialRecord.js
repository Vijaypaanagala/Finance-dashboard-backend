const mongoose = require("mongoose");

const financialRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Type is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FinancialRecord", financialRecordSchema);
