const express = require("express");
const router = express.Router();
const { getAllBoxs, getBoxByExactNum, getCount, addBox, updateBox, deleteBox } = require("../controllers/boxController");
const { auth } = require("../middlewares/auth");

// returns all boxs
router.get("/", getAllBoxs)

router.get("/getByNum/", getBoxByExactNum)

router.get("/count", getCount)

router.post("/", auth, addBox)

router.put("/:id", auth, updateBox)

router.delete("/:id", auth, deleteBox)

module.exports = router;