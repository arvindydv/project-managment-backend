const { Router } = require("express");
const {
  createWorkspace,
  updateWorkspace,
  removeUserFromWorkspace,
} = require("../controllers/workspace.controller");

const { verifyAdmin, verifyToken } = require("../middlewares/auth.middleware");

const router = Router();

router.post("/workspace", verifyToken, createWorkspace);
router.patch("/workspace/:workspaceId", verifyToken, updateWorkspace);
router.delete("/workspace/:workspaceId", verifyToken, updateWorkspace);
router.delete("/remove-user/", verifyToken, removeUserFromWorkspace);

module.exports = router;
