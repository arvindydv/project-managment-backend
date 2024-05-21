const { Router } = require("express");

const {
  createUser,
  loginUser,
  logout,
  resetPassword,
  getAllUsers,
  getUserById,
  deleteUser,
} = require("../controllers/users.controller");
const { verifyAdmin, verifyToken } = require("../middlewares/auth.middleware");

const router = Router();

router.post("/user", verifyAdmin, createUser);
router.post("/login", loginUser);
router.post("/logout", verifyToken, logout);
router.patch("/reset-password", verifyToken, resetPassword);
router.get("/users", verifyAdmin, getAllUsers);
router.get("/user/:userId", verifyToken, getUserById);
router.delete("/user/:userId", verifyAdmin, deleteUser);

module.exports = router;
