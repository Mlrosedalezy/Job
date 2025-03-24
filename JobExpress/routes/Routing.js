var express = require('express');
var router = express.Router();
const { RoutingChildrenModel, RoutingFormModel } = require("../db/db.js");

router.get("/routingList", async (req, res) => {
    try {
        // 查询并关联 RoutingChildren 字段
        const data = await RoutingFormModel.find().populate("RoutingChildren","routerName routerPath");
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/routingChildrenList", async (req, res) => {
    try {
        const data = await RoutingChildrenModel.find();
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;