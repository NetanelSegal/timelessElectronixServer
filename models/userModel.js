const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String, default: "user"
    }
}, { timestamps: true })

exports.UserModel = mongoose.model("users", userSchema);

exports.validateUser = (reqBody, route) => {
    let schema = {}

    if (route == "/login") {
        schema = Joi.object({
            email: Joi.string().min(2).max(150).email().required(),
            password: Joi.string().min(3).max(16).required()
        })
    } else {
        schema = Joi.object({
            name: Joi.string().min(2).max(150).required(),
            email: Joi.string().min(2).max(150).email().required(),
            password: Joi.string().min(3).max(16).required()
        })
    }

    return schema.validate(reqBody)
}