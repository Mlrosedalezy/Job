var express = require('express');
var router = express.Router();
var {QrCodeModel} = require("../db/db")
const  QRCode = require('qrcode')

//新增或更新
router.post("/save-qrcode",async (req,res)=>{
    const {id,name,location,type,description } = req.body
    try{
        let qrCode
        if(id){
            qrCode = await QrCodeModel.findByIdAndUpdate(id,{name,location,type,description})

        }else{
            qrCode = await QrCodeModel({name,location,type,description})
            await qrCode.save()
        }
    } catch(err){
        console.log(err)
        res.send({
            code:200,
            msg:"保存QR码失败"
        })
    }
})



// 生成二维码的路由
router.post('/generate-qrcode', async (req, res) => {
    const { name, location, type } = req.body;
    const img = "http://api.mmp.cc/api/ksvideo?type=mp4&id=jk"

    // 参数说明
    // 类型	必填	名称	说明
    // id	是	jk	jk类型视频
    // id	是	YuMeng	你得欲梦视频
    // id	是	NvDa	女大视频
    // id	是	NvGao	女高视频
    // id	是	ReWu	热舞类型视频
    // id	是	QingCun	清纯类型视频
    // id	是	YuZu	玉足类型视频
    // id	是	SheJie	蛇姐类型视频
    // id	是	ChuanDa	穿搭类型视频
    // id	是	GaoZhiLiangXiaoJieJie	高质量小姐姐视频
    // id	是	HanFu	汉服类型视频
    // id	是	HeiSi	黑手类型视频
    // id	是	BianZhuang	变装类型视频
    // id	是	LuoLi	萝莉类型视频
    // id	是	TianMei	甜妹类型视频
    // id	是	BaiSi	白丝类型视频
    // type	是	mp4	输出短视频
    // type	是	json	输出json视频内容

    // 创建二维码数据
    // const qrcodeData = JSON.stringify({ img});

    try {
        // 生成二维码
        const qrCodeUrl = await QRCode.toDataURL(img);
        res.json({ qrCodeUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '生成QR码失败' });
    }
});

// 获取所有QR码，并支持查询功能
router.get('/qrcodes', async (req, res) => {
    try {
        const { type, name, location, startDate, endDate } = req.query;

        let query = {};

        if (type && type !== '全部') {
            query.type = type;
        }

        if (name) {
            query.name = { $regex: new RegExp(name), $options: 'i' };
        }

        if (location) {
            query.location = { $regex: new RegExp(location), $options: 'i' };
        }

        if (startDate && endDate) {
            query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        } else if (startDate) {
            query.createdAt = { $gte: new Date(startDate) };
        } else if (endDate) {
            query.createdAt = { $lte: new Date(endDate) };
        }

        const qrcodes = await QrCodeModel.find(query).populate("userlist").populate("userTenement");
        res.json({ success: true, data: qrcodes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '获取QR码失败' });
    }
});




// 验证二维码

router.post('/validate-qrcode', async (req, res) => {
    const { qrcodeData } = req.body;
    let data;

    try {
        data = JSON.parse(qrcodeData);
    } catch (error) {
        return res.status(400).json({ error: '无效QR码数据' });
    }

    const { name, location, type } = data;

    // 在这里可以添加更多的验证逻辑，比如检查门的状态、出入类型等
    if (!name || !location || !type) {
        return res.status(400).json({ error: 'QR码数据缺少必填字段' });
    }

    // 假设验证通过，返回成功信息
    res.json({ success: true, message: 'QR码有效' });
});



// 批量启用二维码
router.post('/enable-qrcodes', async (req, res) => {
    const { ids } = req.body;
    try {
        await QrCodeModel.updateMany({ _id: { $in: ids } }, { status: 'enabled' });
        res.json({ success: true, message: '所选二维码已启用' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '启用所选二维码失败' });
    }
});


// 批量禁用二维码
router.post('/disable-qrcodes', async (req, res) => {
    const { ids } = req.body;
    try {
        await QrCodeModel.updateMany({ _id: { $in: ids } }, { status: 'disabled' });
        res.json({ success: true, message: '所选二维码已禁用' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '禁用所选二维码失败' });
    }
});



// 批量删除二维码
router.post('/delete-qrcodes', async (req, res) => {
    const { ids } = req.body;
    try {
        await QrCodeModel.deleteMany({ _id: { $in: ids } });
        res.json({ success: true, message: '所选二维码已删除' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '删除所选二维码失败' });
    }
});

//电子通行证配置
router.post('/save-pass-config', async (req, res) => {
    const {
        id,
        name,
        location,
        type,
        description,
        validityPeriod,
        startDate,
        endDate,
        totalTimes,
        unlimitedTimes,
        usageLimitDays,
        usageLimitIn,
        usageLimitOut,
        unlimitedUsage,
        enabled
    } = req.body;

    try {
        let qrCode;
        if (id) {
            qrCode = await QrCodeModel.findByIdAndUpdate(id, {
                name,
                location,
                type,
                description,
                validityPeriod,
                startDate,
                endDate,
                totalTimes,
                unlimitedTimes,
                usageLimitDays,
                usageLimitIn,
                usageLimitOut,
                unlimitedUsage,
                enabled
            }, { new: true });
        } else {
            qrCode = new QrCodeModel({
                name,
                location,
                type,
                description,
                validityPeriod,
                startDate,
                endDate,
                totalTimes,
                unlimitedTimes,
                usageLimitDays,
                usageLimitIn,
                usageLimitOut,
                unlimitedUsage,
                enabled
            });
            await qrCode.save();
        }

        res.json({ success: true, data: qrCode });
    } catch (err) {
        console.log(err);
        res.send({
            code: 500,
            msg: "保存电子通行证配置失败"
        });
    }
});


// 禁用二维码
router.post('/disable-qrcode', async (req, res) => {
    const { id } = req.body;

    try {
        // 更新数据库中的二维码状态为禁用
        await QrCodeModel.findByIdAndUpdate(id, { status: 'disabled' });
        res.json({ success: true, message: '禁用二维码' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '禁用QR码失败' });
    }
});

// 删除二维码
router.post('/api/delete-qrcode', async (req, res) => {
    const { id } = req.body;

    try {
        // 从数据库中删除二维码
        await QrCodeModel.findByIdAndDelete(id);
        res.json({ success: true, message: '删除二维码' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '删除QR码失败' });
    }
});

// 删除电子通行证配置
router.post('/delete-pass-config', async (req, res) => {
    const { id } = req.body;

    try {
        // 从数据库中删除电子通行证配置
        await QrCodeModel.findByIdAndDelete(id);
        res.json({ success: true, message: '删除电子通行证配置' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '删除电子通行证配置失败' });
    }
});




module.exports = router;