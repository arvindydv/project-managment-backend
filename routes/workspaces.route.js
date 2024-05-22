const { Router } = require("express");

const {
  createWorkspace,
  updateWorkspace,
  removeUserFromWorkspace,
  getAllWorkspace,
  addUserInWorkspace,
} = require("../controllers/workspace.controller");

const { verifyAdmin, verifyToken } = require("../middlewares/auth.middleware");

const router = Router();

router.post("/workspace", verifyToken, createWorkspace);
router.post("/adduser", verifyToken, addUserInWorkspace);
router.patch("/workspace/:workspaceId", verifyToken, updateWorkspace);
router.delete("/workspace/:workspaceId", verifyToken, updateWorkspace);
router.delete("/remove-user", verifyToken, removeUserFromWorkspace);
router.get("/workspace", verifyAdmin, getAllWorkspace);
router.get("/workspace/:workspaceId", verifyToken, getAllWorkspace);

module.exports = router;
