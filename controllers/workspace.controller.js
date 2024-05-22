const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const models = require("../models");
const { Op } = require("sequelize");
const { response } = require("express");

const createWorkspace = asyncHandler(async (req, res) => {
  const payload = req.body;

  if (!payload.name || !payload.description) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Name and description are required"));
  }

  const workspace = await models.Workspace.create(payload);
  if (!workspace) {
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Error While creating workspace"));
  }

  const designation = await models.Designation.findOne({
    where: { designationCode: "101" },
  });

  const workspaceData = {
    userId: req.user.id,
    workspaceId: workspace.dataValues.id,
    designationId: designation.dataValues.id,
  };

  await models.UserWorkspaceMapping.create(workspaceData);
  return res
    .status(201)
    .json(new ApiResponse(201, workspace, "Workspace created successfully"));
});

// update  workspace
const updateWorkspace = asyncHandler(async (req, res) => {
  const workspaceId = req.params.workspaceId;
  const payload = req.body;

  const findWorkspace = await models.Workspace.findOne({
    where: { id: workspaceId },
  });

  if (!findWorkspace) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "Workspace not found"));
  }

  const designation = await models.Designation.findOne({
    where: {
      designationCode: "101",
    },
  });

  const userWorkspaceMapping = await models.UserWorkspaceMapping.findOne({
    where: {
      workspaceId: workspaceId,
      [Op.and]: [
        { userId: req.user.id },
        { designationId: designation.dataValues.id },
      ],
    },
  });

  if (!userWorkspaceMapping) {
    return res
      .status(401)
      .json(
        new ApiResponse(401, {}, "You can not update this workspace mapping")
      );
  }

  const workspace = await models.Workspace.update(payload, {
    where: { id: workspaceId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, workspace, "Workspace updated successfully"));
});

// delete workspace
const deleteWorkspace = asyncHandler(async (req, res) => {
  const workspaceId = req.params.workspaceId;

  const findWorkspace = await models.Workspace.findOne({
    where: { id: workspaceId },
  });

  if (!findWorkspace) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "Workspace not found"));
  }

  const designation = await models.Designation.findOne({
    where: {
      designationCode: "101",
    },
  });

  const userWorkspaceMapping = await models.UserWorkspaceMapping.findOne({
    where: {
      workspaceId: workspaceId,
      [Op.and]: [
        { userId: req.user.id },
        { designationId: designation.dataValues.id },
      ],
    },
  });

  if (!userWorkspaceMapping) {
    return res
      .status(401)
      .json(
        new ApiResponse(401, {}, "You can not delete this workspace mapping")
      );
  }

  await models.Workspace.destroy({
    where: { id: workspaceId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Workspace deleted successfully"));
});

// add user in
const addUserInWorkspace = asyncHandler(async (req, res) => {
  const { payload } = req.body;
  if (!payload.workspaceId || !payload.userId || !payload.designationId) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required"));
  }

  const user = await models.User.findOne({
    where: {
      id: payload.userId,
    },
  });
  if (!user) {
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  const workspace = await models.Workspace.findOne({
    where: {
      id: payload.workspaceId,
    },
  });

  if (!workspace) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "Workspace not found"));
  }

  const designation = await models.Designation.findOne({
    where: {
      id: payload.designationId,
    },
  });

  if (!designation) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "Designation not found"));
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
        new ApiResponse(401, {}, "You can not delete this workspace mapping")
      );
  }

  const addUserInWorkspace = models.UserWorkspaceMapping.create(payload);
  return res
    .status(201)
    .json(new ApiResponse(201, addUserInWorkspace, "User added in workspace"));
});

//  remove user from workspace
const removeUserFromWorkspace = asyncHandler(async (req, res) => {
  const { payload } = req.body;
  if (!payload.workspaceId || !payload.userId || !payload.designationId) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required"));
  }

  const findUser = models.UserWorkspaceMapping.findOne({
    where: {
      workspaceId: workspaceId,
      [Op.and]: [
        { userId: req.user.id },
        { designationId: designation.dataValues.id },
      ],
    },
  });

  if (!findUser) {
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
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
        new ApiResponse(401, {}, "You can not remove User from  workspace.")
      );
  }

  await models.UserWorkspaceMapping.destroy({
    where: { userId: payload.userId },
  });

  return response
    .status(200)
    .json(new ApiResponse(200, {}, "User removed from workspace successfully"));
});

// update user designation in workspace
const updateUserInWorkspace = asyncHandler(async (req, res) => {});

const getAllWorkspace = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const offset = page * limit;

  const workspaces = await models.UserWorkspaceMapping.findAll({
    attributes: {
      exclude: [
        "created_at",
        "userId",
        "designationId",
        "updated_at",
        "deleted_at",
      ],
    },
    include: [
      {
        model: models.Workspace,
        as: "Workspace",
        attributes: ["name"],
      },
      {
        model: models.User,
        as: "User",
        attributes: ["email"],
      },
      {
        model: models.Designation,
        as: "Designation",
        attributes: ["designationTitle"],
      },
    ],
    limit: limit,
    offset: offset,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, workspaces, "All workspaces got successfully"));
});

const getWorkspaceById = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;

  const workspace = await models.UserWorkspaceMapping.findOne({
    where: { workspaceId },
    attributes: {
      exclude: [
        "created_at",
        "userId",
        "designationId",
        "updated_at",
        "deleted_at",
      ],
    },
    include: [
      {
        model: models.Workspace,
        as: "Workspace",
        attributes: ["name"],
      },
      {
        model: models.User,
        as: "User",
        attributes: ["email"],
      },
      {
        model: models.Designation,
        as: "Designation",
        attributes: ["designationTitle"],
      },
    ],
  });

  if (!workspace) {
    return res.status(404).json(new ApiResponse(404, null, "Workspace not found"));
  }

  return res.status(200).json(new ApiResponse(200, workspace, "Workspace retrieved successfully"));
});


module.exports = {
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addUserInWorkspace,
  removeUserFromWorkspace,
  updateUserInWorkspace,
  getAllWorkspace,
  getWorkspaceById
};
