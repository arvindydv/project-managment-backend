const { Router } = require("express");
const { checkHealth } = require("../controllers/test.controller");

const router = Router();

router.get("/", checkHealth)

module.exports = router;