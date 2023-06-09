const { default: mongoose } = require("mongoose");
const Player = require("../models/players");
const Nation = require("../models/nations");
const cloudinary = require("cloudinary").v2;
const getAllPlayers = async (req, res) => {
  try {
    var perPage = 3;
    //pagination
    var total = await Player.find().count();
    var pages = Math.ceil(total / perPage);
    var pageNumber = req.query.page == null ? 1 : req.query.page;
    var startFrom = (pageNumber - 1) * perPage;
    var players = await Player.find({}).populate("nation").skip(startFrom).limit(perPage);

    const nations = await Nation.find();
    // const players = await Player.find().populate("nation");
    res.render("players", { players: players, pages: pages, data: nations, title: "Players Page" });
  } catch (err) {
    res.status(500).json(err);
  }
};

const getPlayerById = async (req, res) => {
  try {
    const id = req.params.id;
    const player = await Player.findById(id).populate("nation");
    console.log("player infor: " + player);
    res.render("playerDetail", { player: player, title: "Player Detail" });
  } catch (err) {
    res.status(500).json(err);
  }
};

const postPlayer = async (req, res) => {
  try {
    const newPlayer = new Player(req.body);
    const savedPlayer = await newPlayer.save();
    res.status(200).json(savedPlayer);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deletePlayerById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("id: " + id);

    const playerDel = await Player.findById({ _id: id });
    const publicId = playerDel.image.split("/").slice(-1)[0].split(".")[0];
    console.log(publicId);
    cloudinary.uploader.destroy("images/" + publicId, function (error, result) {
      if (error) {
        console.log("Error deleting image from Cloudinary:", error.message);
      } else {
        console.log("Image deleted from Cloudinary:", result);
      }
    });

    await Player.deleteOne({ _id: id });
    res.redirect("/players");
  } catch (err) {
    res.status(500).json(err);
  }
};

const formPlayer = async (req, res) => {
  const nations = await Nation.find();
  res.render("addPlayer", { data: nations, title: "From Player" });
};

const createPlayer = async (req, res) => {
  try {
    const file = req.file;
    req.body.image = file?.path;
    if (req.body.isCaptain == "" || req.body.isCaptain == undefined) {
      req.body.isCaptain = false;
    }
    Player.create(req.body);
    res.redirect("/players");
  } catch (err) {
    console.log("error");
    res.status(500).json(err);
  }
};

const formUpdatePlayer = async (req, res) => {
  const nations = await Nation.find();
  const updatePlayer = await Player.findById(req.params.id);
  console.log(updatePlayer.isCaptain);
  res.render("updatePlayer", { player: updatePlayer, data: nations, title: "Update Player" });
};

const updatePlayer = async (req, res) => {
  const file = req.file;
  if (req.body.isCaptain == "" || req.body.isCaptain == undefined) {
    req.body.isCaptain = false;
  }
  console.log(req.body.isCaptain);
  if (req.body.image == "") {
    req.body.image = req.body.originImg;
  } else {
    if (req.file !== undefined) {
      req.body.image = req.file?.path;
      const publicId = req.body.originImg.split("/").slice(-1)[0].split(".")[0];
      console.log("publicId check");
      console.log(publicId);
      cloudinary.uploader.destroy("images/" + publicId, function (error, result) {
        if (error) {
          console.log("Error deleting image from Cloudinary:", error.message);
        } else {
          console.log("Image deleted from Cloudinary:", result);
        }
      });
    }
  }

  await Player.findByIdAndUpdate(req.body._id, req.body);
  res.redirect("/players");
};

module.exports = {
  getAllPlayers,
  postPlayer,
  getPlayerById,
  deletePlayerById,
  createPlayer,
  formPlayer,
  updatePlayer,
  formUpdatePlayer,
};
