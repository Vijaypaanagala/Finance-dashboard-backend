const FinancialRecord = require("../models/FinancialRecord");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const {
  validateObjectId,
  validatePositiveNumber,
  validateEnum,
  validateRequiredString,
  parseOptionalDate,
  isNonEmptyString,
} = require("../utils/validators");

const createRecord = asyncHandler(async (req, res) => {
  const { userId, amount, type, category, date, note } = req.body;

  const payload = {
    userId: validateObjectId(userId, "user id"),
    amount: validatePositiveNumber(amount, "Amount"),
    type: validateEnum(type, ["income", "expense"], "Type"),
    category: validateRequiredString(category, "Category"),
  };

  const parsedDate = parseOptionalDate(date, "date");
  if (parsedDate) {
    payload.date = parsedDate;
  }
  if (note !== undefined) {
    payload.note = String(note).trim();
  }

  const record = await FinancialRecord.create(payload);

  return res.status(201).json({
    message: "Record created successfully",
    data: record,
  });
});

const getAllRecords = asyncHandler(async (req, res) => {
  const { type, category, note, startDate, endDate, page = 1, limit = 10 } = req.query;
  const filters = {};

  if (type !== undefined) {
    filters.type = validateEnum(type, ["income", "expense"], "Type");
  }

  if (category !== undefined) {
    const trimmedCategory = validateRequiredString(category, "Category");
    filters.category = { $regex: trimmedCategory, $options: "i" };
  }

  if (note !== undefined) {
    const trimmedNote = validateRequiredString(note, "Note");
    filters.note = { $regex: trimmedNote, $options: "i" };
  }

  const parsedStartDate = parseOptionalDate(startDate, "startDate");
  const parsedEndDate = parseOptionalDate(endDate, "endDate");
  if (parsedStartDate || parsedEndDate) {
    filters.date = {};
    if (parsedStartDate) {
      filters.date.$gte = parsedStartDate;
    }
    if (parsedEndDate) {
      filters.date.$lte = parsedEndDate;
    }
  }

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);
  if (!Number.isInteger(parsedPage) || parsedPage < 1) {
    throw new ApiError(400, "Page must be a positive integer");
  }
  if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
    throw new ApiError(400, "Limit must be an integer between 1 and 100");
  }

  const skip = (parsedPage - 1) * parsedLimit;

  const [records, total] = await Promise.all([
    FinancialRecord.find(filters)
      .populate("userId", "name email role status")
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit),
    FinancialRecord.countDocuments(filters),
  ]);

  return res.status(200).json({
    message: "Records fetched successfully",
    data: records,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.ceil(total / parsedLimit),
    },
  });
});

const updateRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, amount, type, category, date, note } = req.body;
  const recordId = validateObjectId(id, "record id");

  const updatePayload = {};

  if (userId !== undefined) {
    updatePayload.userId = validateObjectId(userId, "user id");
  }
  if (amount !== undefined) {
    updatePayload.amount = validatePositiveNumber(amount, "Amount");
  }
  if (type !== undefined) {
    updatePayload.type = validateEnum(type, ["income", "expense"], "Type");
  }
  if (category !== undefined) {
    updatePayload.category = validateRequiredString(category, "Category");
  }
  if (date !== undefined) {
    updatePayload.date = parseOptionalDate(date, "date");
  }
  if (note !== undefined) {
    updatePayload.note = isNonEmptyString(note) ? note.trim() : "";
  }

  if (Object.keys(updatePayload).length === 0) {
    throw new ApiError(400, "Provide at least one field to update");
  }

  const updatedRecord = await FinancialRecord.findByIdAndUpdate(recordId, updatePayload, {
    new: true,
    runValidators: true,
  }).populate("userId", "name email role status");

  if (!updatedRecord) {
    throw new ApiError(404, "Record not found");
  }

  return res.status(200).json({
    message: "Record updated successfully",
    data: updatedRecord,
  });
});

const deleteRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const recordId = validateObjectId(id, "record id");

  const deletedRecord = await FinancialRecord.findByIdAndDelete(recordId);
  if (!deletedRecord) {
    throw new ApiError(404, "Record not found");
  }

  return res.status(200).json({
    message: "Record deleted successfully",
  });
});

module.exports = {
  createRecord,
  getAllRecords,
  updateRecord,
  deleteRecord,
};
