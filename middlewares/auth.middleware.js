const { asyncHandler } = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const models = require("../models");
const { ApiResponse } = require("../utils/ApiResponse");

const verifyAdmin = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer", "");

  if (!token) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Unauthorized request"));
  }

  const decodeToken = await jwt.verify(token, process.env.ASSESS_TOKEN_SECRET);

  const user = await models.User.findOne({
    where: { id: decodeToken?.userId },
  });
  if (!user || user.role === "USR") {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Only Admin can create user."));
  }

  req.user = user;
  next();
});

const verifyToken = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer", "");

  if (!token) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Unauthorized request"));
  }

  const decodeToken = await jwt.verify(token, process.env.ASSESS_TOKEN_SECRET);

  const user = await models.User.findOne({
    where: { id: decodeToken?.userId },
  });
  if (!user) {
    return res.status(401).json(new ApiResponse(401, {}, "Invalid token"));
  }

  req.user = user;
  next();
});

module.exports = {
  verifyAdmin,
  verifyToken,
};
