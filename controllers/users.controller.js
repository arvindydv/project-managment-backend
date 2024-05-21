const models = require("../models");
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const rpgenerator = require("rpgenerator");
const { ApiResponse } = require("../utils/ApiResponse");
const { sendEmailVerification } = require("../utils/sendMail");

const createUser = asyncHandler(async (req, res) => {
  const payload = req.body;
  if (!payload.firstName || !payload.lastName || !payload.email) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required"));
  }

  // check user exist or not
  const existUser = await models.User.findOne({
    where: { email: payload.email },
  });
  if (existUser) {
    return res
      .status(409)
      .json(new ApiResponse(409, {}, "User is already exist"));
  }
  const password = rpgenerator();
  payload.password = await bcrypt.hash(password, 10);
  const user = await models.User.create(payload);
  const userWithoutPassword = user.get({ plain: true });
  delete userWithoutPassword.password;
  sendEmailVerification(user.dataValues.email, password);

  return res
    .status(201)
    .json(
      new ApiResponse(201, userWithoutPassword, "User registered successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const payload = req.body;

  if (!payload.email || !payload.password) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Email and password are required"));
  }

  const user = await models.User.findOne({
    where: { email: payload.email },
  });
  if (!user) {
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    user.dataValues.password
  );
  if (!isPasswordValid) {
    return res.status(400).json(new ApiResponse(400, {}, "invaild password"));
  }

  const accessToken = jwt.sign(
    { userId: user.dataValues.id },
    process.env.ASSESS_TOKEN_SECRET
  );

  const loggedInUser = await models.User.findOne({
    where: { id: user.dataValues.id },
    attributes: { exclude: ["password"] }, // Exclude the password field
  });

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken: accessToken,
        },
        "User logged in successfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const payload = req.body;
  if (!payload.password || !payload.newPassword || !payload.email) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required"));
  }

  const user = await models.User.findOne({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  if (user.dataValues.id !== req.user.id) {
    return res.status(401).json(new ApiResponse(401, {}, "Unauthorized user"));
  }

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    user.dataValues.password
  );
  if (!isPasswordValid) {
    return res.status(400).json(new ApiResponse(400, {}, "invaild password"));
  }

  const newPassword = await bcrypt.hash(payload.newPassword, 10);
  await models.User.update(
    { password: newPassword },
    { where: { id: user.dataValues.id } }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});

// const getAllUsers = asyncHandler (async (req, res)=>{

// })

module.exports = {
  createUser,
  loginUser,
  logout,
  resetPassword,
};
