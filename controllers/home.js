const { default: mongoose } = require("mongoose");
const Player = require("../models/players");
const Nations = require("../models/nations");
const Users = require("../models/users");
const getAllInfo = async (req, res) => {
  try {
    var perPage = 3;
    var total = await Player.find().count();
    var pages = Math.ceil(total / perPage);
    var pageNumber = req.query.page == null ? 1 : req.query.page;
    var startFrom = (pageNumber - 1) * perPage;
    var players = await Player.find({ isCaptain: true }).populate("nation").skip(startFrom).limit(perPage);

    res.render("home", { players: players, pages: pages, title: "Home Page" });
  } catch (err) {
    res.status(500).json(err);
  }
};

const login = (req, res) => {
  res.render("login", {
    title: "Login",
    errors: req.flash("errors"),
    success: req.flash("success"),
    email: req.flash("email"),
    password: req.flash("password"),
  });
};

const register = (req, res) => {
  res.render("register", {
    title: "Register",
    errors: req.flash("errors"),
    email: req.flash("email"),
    password: req.flash("password"),
    name: req.flash("name"),
    dob: req.flash("dob"),
  });
};

const forgotPassword = (req, res) => {
  res.render("forgotPassword", {
    title: "Forgot Password",
    errors: req.flash("errors"),
    email: req.flash("emailForgot"),
  });
};

const confirmOTP = async (req, res) => {
  const email = req.flash("emailConfirm")[0];

  res.render("confirmOTP", {
    title: "Confirm OTP",
    errors: req.flash("errors"),
    email: email,
    success: req.flash("success"),
  });
};

const resetPassword = (req, res) => {
  const email = req.flash("emailReset")[0];
  res.render("resetPassword", {
    title: "Reset Password",
    errors: req.flash("errors"),
    email: email,
    success: req.flash("success"),
  });
};

const searchPlayers = async (req, res) => {
  const searchQuery = new RegExp(req.query.search, "i"); // case-insensitive search
  const perPage = 3;
  const total = await Player.find({ name: searchQuery, isCaptain: true }).count();
  console.log(total);
  const pages = Math.ceil(total / perPage);
  const pageNumber = req.query.page == null ? 1 : req.query.page;
  const startFrom = (pageNumber - 1) * perPage;
  const listPlayer = await Player.find({ name: searchQuery, isCaptain: true })
    .populate("nation")
    .skip(startFrom)
    .limit(perPage);

  // console.log(listPlayer);
  res.render("search", {
    list: listPlayer,
    title: "Search Page",
    searchQuery: req.query.search,
    pages: pages,
    total: total,
  });
};
module.exports = {
  getAllInfo,
  login,
  register,
  searchPlayers,
  forgotPassword,
  confirmOTP,
  resetPassword,
};
