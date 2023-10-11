const { BoxModel, validateBox } = require("../models/boxModel");

const boxCtrl = {
    async getAllBoxs(req, res) {
        try {
            const { limit = 20, sort = "_id" } = req.query;

            const page = req.query.page - 1 || 0;
            const reverse = req.query.reverse == "yes" ? 1 : -1

            const data = await BoxModel.find({})
                .limit(limit)
                .skip(page * limit).sort({ [sort]: reverse })

            res.json(data);
        } catch (err) {
            console.log(err);
            res.status(502).json({ err });
        }
    },
    async getBoxByExactNum(req, res) {
        try {
            const boxNumber = req.query.num
            if (!boxNumber) {
                return res.status(400).json({ err: "Enter box number" });
            }

            const data = await BoxModel.find({ boxNumber });

            res.json(data);
        } catch (err) {
            console.log(err);
            res.status(502).json({ err });
        }
    },
    async getCount(req, res) {
        try {
            const limit = req.query.limit || 20;

            const count = await BoxModel.countDocuments({});

            res.json({ count, page: Math.ceil(count / limit) });
        } catch (err) {
            console.log(err);
            res.status(502).json({ err });
        }
    },
    async addBox(req, res) {
        const bodyValidation = validateBox(req.body);
        if (bodyValidation.error) {
            return res.status(403).json(bodyValidation.error.details);
        }
        try {
            const box = await BoxModel.create(req.body);
            res.status(201).json(box);
        } catch (err) {
            console.log(err);
            res.status(502).json({ err });
        }
    },
    async updateBox(req, res) {
        const bodyValidation = validateBox(req.body);
        if (bodyValidation.error) {
            return res.status(403).json(bodyValidation.error.details);
        }
        try {
            const box = await BoxModel.updateOne({ _id: req.params.id }, req.body);
            res.status(201).json(box);
        } catch (err) {
            console.log(err);
            res.status(502).json({ err });
        }
    },
    async deleteBox(req, res) {
        try {
            const box = await BoxModel.deleteOne({ _id: req.params.id });
            res.status(201).json(box);
        } catch (err) {
            console.log(err);
            res.status(502).json({ err });
        }
    }
};

module.exports = boxCtrl;
