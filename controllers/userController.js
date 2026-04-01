const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { validateEmail, validateObjectId, validateRequiredString, validateEnum } = require("../utils/validators");

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, status } = req.body;

  const normalizedName = validateRequiredString(name, "Name");
  const normalizedEmail = validateEmail(email);
  const normalizedPassword = validateRequiredString(password, "Password");

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(400, "Email already exists");
  }

  const payload = {
    name: normalizedName,
    email: normalizedEmail,
    password: normalizedPassword,
  };

  if (role !== undefined) {
    payload.role = validateEnum(role, ["viewer", "analyst", "admin"], "Role");
  }

  if (status !== undefined) {
    payload.status = validateEnum(status, ["active", "inactive"], "Status");
  }

  const user = await User.create(payload);

  return res.status(201).json({
    message: "User created successfully",
    data: user,
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  return res.status(200).json({
    message: "Users fetched successfully",
    data: users,
  });
});

const updateUserRoleAndStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role, status } = req.body;
  const userId = validateObjectId(id, "user id");

  if (role === undefined && status === undefined) {
    throw new ApiError(400, "Provide role or status to update");
  }

  const updatePayload = {};

  if (role !== undefined) {
    updatePayload.role = validateEnum(role, ["viewer", "analyst", "admin"], "Role");
  }

  if (status !== undefined) {
    updatePayload.status = validateEnum(status, ["active", "inactive"], "Status");
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updatePayload, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json({
    message: "User updated successfully",
    data: updatedUser,
  });
});

module.exports = {
  createUser,
  getAllUsers,
  updateUserRoleAndStatus,
};
