const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const models = require("../models");
const moment = require("moment");

// create task controller
const createTask = asyncHandler(async (req, res) => {
  const payload = req.body;

  if (
    !payload.task ||
    payload.description ||
    !payload.deadline ||
    !payload.sprintId ||
    !payload.userId
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required"));
  }

  const sprint = await models.Sprint.findOne({
    where: { id: payload.sprintId },
  });

  if (!sprint) {
    return res.status(404).json(new ApiResponse(404, {}, "Sprint not found"));
  }

  const user = await models.User.findOne({
    where: { id: payload.userId },
  });

  if (!user) {
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  const UserDesignation = await models.Designation.findOne({
    where: {
      designationCode: "101",
    },
  });

  const userWorkspaceMapping = await models.UserWorkspaceMapping.findOne({
    where: {
      workspaceId: sprint.dataValues.workspaceId,
      [Op.and]: [
        { userId: req.user.id },
        { designationId: UserDesignation.dataValues.id },
      ],
    },
  });

  if (!userWorkspaceMapping) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "You cannot create task"));
  }
  const currentTimeDateTime = moment().format("YYYY-MM-DD HH:mm:s");
  const deadline = payload.deadline;
  if (deadline <= currentTimeDateTime) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid deadline"));
  }

  const task = await models.Task.create(payload);

  return res
    .status(201)
    .json(new ApiResponse(401, task, "Task created successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;
  const payload = req.body;

  const findTask = await models.Task.findOne({
    where: {
      id: taskId,
    },
  });

  if (!findTask) {
    return res.status(404).json(new ApiResponse(404, {}, "Task not found"));
  }
  const sprint = await models.Sprint.findOne({
    where: { id: findTask.dataValues.sprintId },
  });

  const userWorkspaceMapping = await models.UserWorkspaceMapping.findOne({
    where: {
      workspaceId: sprint.dataValues.workspaceId,
      [Op.and]: [
        { userId: req.user.id },
        { designationId: UserDesignation.dataValues.id },
      ],
    },
  });

  if (!userWorkspaceMapping) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "You cannot update task"));
  }

  const task = await models.Task.update(payload, {
    where: { id: taskId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
});

// delete task
const deletask = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;

  const findTask = await models.Task.findOne({
    where: {
      id: taskId,
    },
  });

  if (!findTask) {
    return res.status(404).json(new ApiResponse(404, {}, "Task not found"));
  }
  const sprint = await models.Sprint.findOne({
    where: { id: findTask.dataValues.sprintId },
  });

  const userWorkspaceMapping = await models.UserWorkspaceMapping.findOne({
    where: {
      workspaceId: sprint.dataValues.workspaceId,
      [Op.and]: [
        { userId: req.user.id },
        { designationId: UserDesignation.dataValues.id },
      ],
    },
  });

  if (!userWorkspaceMapping) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "You cannot delete task"));
  }

  await models.Task.destroy({
    where: { id: taskId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;

  const task = await models.Task.findOne({
    where: { id: taskId },
  });

  if (!task) {
    return res.status(404).json(404, {}, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task got successfully"));
});

module.exports = {
  createTask,
  updateTask,
  deletask,
  getTaskById,
};
