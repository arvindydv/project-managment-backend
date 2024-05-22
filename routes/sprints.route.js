const { Router } = require("express");
const {
  createSprint,
  updateSprint,
  deleteSPrint,
  getAllSprints,
} = require("../controllers/sprint.controller");

const { verifyToken } = require("../middlewares/auth.middleware");

const router = Router();

router.post("/sprint", verifyToken, createSprint);
router.patch("/sprint/:sprintId", verifyToken, updateSprint);
router.delete("/sprint/:sprintId", verifyToken, deleteSPrint);
router.get("/sprint", verifyToken, getAllSprints);

module.exports = router;
