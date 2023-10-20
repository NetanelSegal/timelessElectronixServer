const { BoxModel, validateBox } = require("../models/boxModel");

const getMaxColInBlock = async (box) => {
    try {
        const { blockFromRight, isInsideRow, level, areaInWarehouse } = box
        const maxColBox = await BoxModel.findOne({ areaInWarehouse, blockFromRight, isInsideRow, level }).sort({ columnFromRight: -1 })
        return maxColBox.columnFromRight
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }

}
const getMaxNumInCol = async (box) => {
    try {
        const { blockFromRight, columnFromRight, isInsideRow, level, areaInWarehouse } = box
        const maxNumFromTopBox = await BoxModel.findOne({ areaInWarehouse, blockFromRight, columnFromRight, isInsideRow, level }).sort({ numFromTop: -1 })
        return maxNumFromTopBox.numFromTop
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }

}

const boxCtrl = {
    async getAllBoxs(req, res) {
        try {
            const { limit = 20, sort = "_id", sKey, sVal } = req.query;
            const page = req.query.page - 1 || 0;
            const reverse = req.query.reverse == "yes" ? 1 : -1

            let filterData = {}

            if (sKey && sVal) {
                if (sVal == "yes") {
                    filterData = { [sKey]: true }
                } else if (Number(sVal) || sVal == "0") {
                    filterData = { [sKey]: Number(sVal) }
                } else {
                    filterData = { [sKey]: RegExp(sVal, "i") }
                }
            }

            const data = await BoxModel.find(filterData)
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

            const newArr = await Promise.all(data.map(async (b) => {
                const maxColNum = await getMaxColInBlock(b)

                const maxBoxNumFromTop = await getMaxNumInCol(b)
                return ({ ...b._doc, maxColNum, maxBoxNumFromTop });
            }))
            res.json(newArr);
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
            const box = BoxModel(req.body);
            let boxsFilter = {}

            // מציאת כל הארגזים באותה עמודה עי פילטר
            if (box._doc.areaInWarehouse.includes("מידוף")) {
                boxsFilter = {
                    areaInWarehouse: box._doc.areaInWarehouse,
                    blockFromRight: box._doc.blockFromRight,
                    isInsideRow: box._doc.isInsideRow,
                    level: box._doc.level,
                    columnFromRight: box._doc.columnFromRight,
                    numFromTop: { $gte: box._doc.numFromTop }
                }
            } else {
                boxsFilter = {
                    areaInWarehouse: box._doc.areaInWarehouse,
                    columnFromRight: box._doc.columnFromRight,
                    numFromTop: { $gte: box._doc.numFromTop }
                }
            }
            const boxsFromCol = await BoxModel.updateMany(boxsFilter, { $inc: { numFromTop: 1 } }).sort({ numFromTop: 1 });

            await box.save()

            res.status(201).json({ box, boxsFromCol });
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
            const box = await BoxModel.findOneAndDelete({ _id: req.params.id });
            console.log(box);

            let boxsFilter = {}

            // מציאת כל הארגזים באותה עמודה עי פילטר
            if (box._doc.areaInWarehouse.includes("מידוף")) {
                boxsFilter = {
                    areaInWarehouse: box._doc.areaInWarehouse,
                    blockFromRight: box._doc.blockFromRight,
                    isInsideRow: box._doc.isInsideRow,
                    level: box._doc.level,
                    columnFromRight: box._doc.columnFromRight,
                    numFromTop: { $gte: box._doc.numFromTop }
                }
            } else {
                boxsFilter = {
                    areaInWarehouse: box._doc.areaInWarehouse,
                    columnFromRight: box._doc.columnFromRight,
                    numFromTop: { $gte: box._doc.numFromTop }
                }
            }
            console.log(boxsFilter);
            const boxsFromCol = await BoxModel.updateMany(boxsFilter, { $inc: { numFromTop: -1 } }).sort({ numFromTop: 1 });
            console.log(boxsFromCol);
            res.status(201).json({ box, boxsFromCol });
        } catch (err) {
            console.log(err);
            res.status(502).json({ err });
        }
    }
};

module.exports = boxCtrl;
