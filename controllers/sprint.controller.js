const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const models = require("../models");
const moment = require("moment");
const { response } = require("express");

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

  if (!userWorkspaceMapping) {
    return res
      .status(401)
      .json(
        new ApiResponse(401, {}, "You cannot create sprint in this workspace")
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

  const UserDesignation = await models.Designation.findOne({
    where: {
      designationCode: "101",
    },
  });

  const userWorkspaceMapping = await models.UserWorkspaceMapping.findOne({
    where: {
      workspaceId: findSprint.dataValues.workspaceId,
      [Op.and]: [
        { userId: req.user.id },
        { designationId: UserDesignation.dataValues.id },
      ],
    },
  });

  if (!userWorkspaceMapping) {
    return res
      .status(401)
      .json(
        new ApiResponse(401, {}, "You cannot update sprint in this workspace")
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
const deleteSPrint = asyncHandler(async (req, res) => {
  const sprintId = req.params.sprintId;

  const findSprint = await models.Sprint.findOne({ id: sprintId });
  if (!findSprint) {
    return res.status(404).json(new ApiResponse(404, {}, "Sprint not found"));
  }

  const UserDesignation = await models.Designation.findOne({
    where: {
      designationCode: "101",
    },
  });

  const userWorkspaceMapping = await models.UserWorkspaceMapping.findOne({
    where: {
      workspaceId: findSprint.dataValues.workspaceId,
      [Op.and]: [
        { userId: req.user.id },
        { designationId: UserDesignation.dataValues.id },
      ],
    },
  });

  if (!userWorkspaceMapping) {
    return res
      .status(401)
      .json(
        new ApiResponse(401, {}, "You cannot delete sprint in this workspace")
      );
  }

  await models.Sprint.destroy({
    where: {
      id: sprintId,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "sprint deleted successfully"));
});

const getAllSprints = asyncHandler(async (req, res) => {
  const workspaceId = req.params.workspaceId;
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const offset = page * limit;

  const sprints = await models.Sprint.findAll({
    where: { workspaceId: workspaceId },
    attributes: {
      exclude: ["created_at", "updated_at", "deleted_at"],
    },
    include: [
      {
        model: models.Task,
        as: "Task",
        attributes: ["task", "description", "deadline", "status", "userId"],
      },
    ],
    limit: limit,
    offset: offset,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, sprints, "Sprint retrieved successfully"));
});

module.exports = {
  createSprint,
  updateSprint,
  deleteSPrint,
  getAllSprints,
};
