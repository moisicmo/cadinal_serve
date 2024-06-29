const { Router } = require("express");

const {
  processPayment,
} = require("../controllers/centinel.controller");
const router = Router();



router.post(
  "/",
  processPayment
);


module.exports = router;
