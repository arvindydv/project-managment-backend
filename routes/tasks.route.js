const { Router } = require("express");

const {
  createTask,
  updateTask,
  deletask,
  getTaskById,
} = require("../controllers/task.controller");

const { verifyToken } = require("../middlewares/auth.middleware");

const router = Router();

router.post("/task", verifyToken, createTask);
router.patch("/task/:taskId", verifyToken, updateTask);
router.delete("/task/:taskId", verifyToken, deletask);
router.get("/task/:taskId", verifyToken, getTaskById);
// router.delete("/remove-user/", verifyToken, removeUserFromWorkspace);

module.exports = router;
