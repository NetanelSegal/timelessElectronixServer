const { UserModel, validateUser } = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const userCtrl = {
    async getUserInfo(req, res) {
        try {
            const user = await UserModel.findOne({ _id: req.userData.id }, { password: 0 })
            res.json(user)
        }
        catch (err) {
            console.log(err);
            res.status(502).json({ err })
        }
    },
    async signupUser(req, res) {
        const userValidation = validateUser(req.body)
        if (userValidation.error) {
            return res.status(403).json(userValidation.error.details)
        }
        try {
            const user = UserModel(req.body)
            user.password = await bcrypt.hash(user.password, 10)
            await user.save()
            user.password = "********"
            res.json(user)
        }
        catch (err) {
            if (err.code == 11000) {
                return res.status(409).json({ err: "Email already exist" })
            }
            console.log(err);
            res.status(502).json({ err })
        }
    },
    async loginUser(req, res) {
        const userValidation = validateUser(req.body, "/login")
        if (userValidation.error) {
            return res.status(403).json(userValidation.error.details)
        }
        try {
            const user = await UserModel.findOne({ email: req.body.email })

            if (!user) {
                return res.status(401).json({ err: "Email not found" })
            }

            const passValidation = await bcrypt.compare(req.body.password, user.password)

            if (!passValidation) {
                return res.status(401).json({ err: "Password is incorrect" })
            }

            const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "600mins" });
            res.json({ token })
        }
        catch (err) {
            console.log(err);
            res.status(502).json({ err })
        }
    },
}

module.exports = userCtrl