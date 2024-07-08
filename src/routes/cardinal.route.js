const { Router } = require("express");

const {
  createjwt,
  processPayment,
} = require("../controllers/centinel.controller");
const router = Router();

router.get("/", createjwt);

router.post("/", processPayment);

module.exports = router;
