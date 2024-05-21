const { Router } = require("express");
const {
  createSprint,
  updateSprint,
} = require("../controllers/sprint.controller");

const { verifyToken } = require("../middlewares/auth.middleware");

const router = Router();

router.post("/sprint", verifyToken, createSprint);
router.patch("/sprint/:sprintId", verifyToken, updateSprint);
// router.delete("/workspace/:workspaceId", verifyToken, updateWorkspace);
// router.delete("/remove-user/", verifyToken, removeUserFromWorkspace);

module.exports = router;
