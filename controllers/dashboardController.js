const FinancialRecord = require("../models/FinancialRecord");

const getSummary = async (req, res) => {
  try {
    const totals = await FinancialRecord.aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalIncome = totals.find((item) => item._id === "income")?.total || 0;
    const totalExpense = totals.find((item) => item._id === "expense")?.total || 0;
    const netBalance = totalIncome - totalExpense;

    return res.status(200).json({
      message: "Summary fetched successfully",
      data: {
        totalIncome,
        totalExpense,
        netBalance,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch summary" });
  }
};

const getCategoryWiseTotals = async (req, res) => {
  try {
    const categoryTotals = await FinancialRecord.aggregate([
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalAmount: 1,
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
    ]);

    return res.status(200).json({
      message: "Category totals fetched successfully",
      data: categoryTotals,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch category totals" });
  }
};

const getRecentTransactions = async (req, res) => {
  try {
    const recentTransactions = await FinancialRecord.find()
      .populate("userId", "name email role status")
      .sort({ date: -1, createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      message: "Recent transactions fetched successfully",
      data: recentTransactions,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch recent transactions" });
  }
};

const getMonthlyTrends = async (req, res) => {
  try {
    const monthlyTrends = await FinancialRecord.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalIncome: 1,
          totalExpense: 1,
          netBalance: { $subtract: ["$totalIncome", "$totalExpense"] },
        },
      },
      {
        $sort: { year: 1, month: 1 },
      },
    ]);

    return res.status(200).json({
      message: "Monthly trends fetched successfully",
      data: monthlyTrends,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch monthly trends" });
  }
};

module.exports = {
  getSummary,
  getCategoryWiseTotals,
  getRecentTransactions,
  getMonthlyTrends,
};
