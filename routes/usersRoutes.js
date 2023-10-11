const express = require("express");
const router = express.Router();
const { getUserInfo, signupUser, loginUser } = require("../controllers/usersController");
const { auth, adminAuth } = require("../middlewares/auth");

router.get("/", async (req, res) => {
    try {
        res.json({ msg: "cannot get users" })
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.get("/myInfo", auth, adminAuth, getUserInfo)

router.post("/", signupUser)

router.post("/login", loginUser)



module.exports = router;