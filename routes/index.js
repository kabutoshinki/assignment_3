var express = require("express");
const Nations = require("../models/nations");
var router = express.Router();
var {
  getAllInfo,
  login,
  register,
  searchPlayers,
  forgotPassword,
  confirmOTP,
  resetPassword,
} = require("../controllers/home.js");

router.get("/", getAllInfo);
router.get("/login", login);
router.get("/register", register);
router.get("/forgotPassword", forgotPassword);
router.get("/confirmOTP", confirmOTP);
router.get("/resetPassword", resetPassword);
router.get("/search", searchPlayers);
module.exports = router;
