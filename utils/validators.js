const mongoose = require("mongoose");
const ApiError = require("./ApiError");

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

const validateRequiredString = (value, fieldName) => {
  if (!isNonEmptyString(value)) {
    throw new ApiError(400, `${fieldName} is required`);
  }
  return value.trim();
};

const validateEmail = (email) => {
  const normalizedEmail = validateRequiredString(email, "Email").toLowerCase();
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(normalizedEmail)) {
    throw new ApiError(400, "Invalid email format");
  }
  return normalizedEmail;
};

const validateObjectId = (id, fieldName) => {
  if (!isNonEmptyString(id) || !mongoose.Types.ObjectId.isValid(id.trim())) {
    throw new ApiError(400, `Invalid ${fieldName}`);
  }
  return id.trim();
};

const validatePositiveNumber = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    throw new ApiError(400, `${fieldName} is required`);
  }
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new ApiError(400, `${fieldName} must be a number greater than 0`);
  }
  return parsed;
};

const validateEnum = (value, allowedValues, fieldName) => {
  if (!isNonEmptyString(value)) {
    throw new ApiError(400, `${fieldName} is required`);
  }
  const normalized = value.trim().toLowerCase();
  if (!allowedValues.includes(normalized)) {
    throw new ApiError(400, `${fieldName} must be ${allowedValues.join(" or ")}`);
  }
  return normalized;
};

const parseOptionalDate = (value, fieldName) => {
  if (value === undefined) {
    return undefined;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new ApiError(400, `Invalid ${fieldName}`);
  }
  return parsed;
};

module.exports = {
  isNonEmptyString,
  validateRequiredString,
  validateEmail,
  validateObjectId,
  validatePositiveNumber,
  validateEnum,
  parseOptionalDate,
};
