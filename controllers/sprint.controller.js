const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const models = require("../models");
const moment = require("moment");
const { response } = require("express");

// Check user designation
const isManager = async () => {
  const UserDesignation = await models.Designation.findOne({
    where: {
      designationCode: "101",
    },
  });

  const userWorkspaceMapping = await models.UserWorkspaceMapping.findOne({
    where: {
      workspaceId: workspace.dataValues.id,
      [Op.and]: [
        { userId: req.user.id },
        { designationId: UserDesignation.dataValues.id },
      ],
    },
  });

  return userWorkspaceMapping;
};

// create sprint
const createSprint = asyncHandler(async (req, res) => {
  const payload = req.body;
  if (
    !payload.name ||
    !payload.description ||
    !payload.deadline ||
    !payload.workspaceId
  ) {
    return res
      .status(400)
      .send(new ApiResponse(400, {}, "All fields are required"));
  }

  //   const UserDesignation = await models.Designation.findOne({
  //     where: {
  //       designationCode: "101",
  //     },
  //   });

  //   const userWorkspaceMapping = await models.UserWorkspaceMapping.findOne({
  //     where: {
  //       workspaceId: workspace.dataValues.id,
  //       [Op.and]: [
  //         { userId: req.user.id },
  //         { designationId: UserDesignation.dataValues.id },
  //       ],
  //     },
  //   });

  const checkUserIsManager = isManager();

  if (!checkUserIsManager) {
    return res
      .status(401)
      .json(
        new ApiResponse(401, {}, "You can not create sprint in this workspace.")
      );
  }

  const currentTimeDateTime = moment().format("YYYY-MM-DD HH:mm:s");
  const deadline = payload.deadline;
  if (deadline <= currentTimeDateTime) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid deadline"));
  }

  const sprint = await models.Sprint.create(payload);

  return res
    .status(201)
    .json(new ApiResponse(201, sprint, "Sprint created successfully"));
});

// update sprint
const updateSprint = asyncHandler(async (req, res) => {
  const payload = req.body;
  const sprintId = req.params.sprintId;

  const findSprint = await models.Sprint.findOne({ id: sprintId });
  if (!findSprint) {
    return res.status(404).json(new ApiResponse(404, {}, "Sprint not found"));
  }

  const checkUserIsManager = isManager();
  if (!checkUserIsManager) {
    return res
      .status(401)
      .json(
        new ApiResponse(401, {}, "You can not update sprint in this workspace.")
      );
  }

  const sprint = await models.Sprint.update(payload, {
    where: { id: sprintId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, sprint, "Sprint updated successfully"));
});

// delete  sprint
const deleteSPrint = asyncHandler(async (req, res) => {});

module.exports = {
  createSprint,
  updateSprint,
  deleteSPrint,
};
