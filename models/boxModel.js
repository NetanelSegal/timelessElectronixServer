const mongoose = require("mongoose")
const Joi = require("joi");

const boxSchema = mongoose.Schema({
    boxNumber: String,
    areaInWarehouse: String,
    blockFromRight: Number,
    level: Number,
    isInsideRow: Boolean,
    columnFromRight: Number,
    numFromTop: Number,
    extraInfo: String
}, { timestamps: true })

exports.BoxModel = new mongoose.model("boxs", boxSchema)

exports.validateBox = (reqBody) => {
    const schema = Joi.object({
        boxNumber: Joi.string().min(2).max(50).required(),
        areaInWarehouse: Joi.string().min(2).max(50).required(),
        blockFromRight: Joi.number().min(2).max(50).allow(null),
        level: Joi.number().min(0).max(3).allow(null),
        isInsideRow: Joi.boolean().allow(null),
        columnFromRight: Joi.number().min(0).max(700).allow(null),
        numFromTop: Joi.number().min(0).max(700).allow(null),
        extraInfo: Joi.string().min(0).max(700).allow(null, "")
    })

    return schema.validate(reqBody)
}