const express = require("express");
const router = express.Router();
const boxsRoutes = require("./boxsRoutes");
const usersRoutes = require("./usersRoutes");

router.use("/boxs", boxsRoutes)

router.use("/users", usersRoutes)

router.use("/", (req, res) => {
    res.json({ msg: "index route working" })
})

module.exports = router;