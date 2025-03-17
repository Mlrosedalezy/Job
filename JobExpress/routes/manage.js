var express = require('express');
var router = express.Router();
const { Base64 } = require('js-base64')
const {
  communityListModel,
  buildlistModel,
  unitListModel,
  floorListModel,
  houseListModel,
} = require('../db/db')

router.post('/housemanage', async (req, res) => {
  let id = Base64.decode(req.body.id)
  // let data = []
  // let houselist = await houseListModel.find()
  // .populate({
  //     path: 'floorId',
  //     populate: ({
  //       path: 'unitId', // 填充 floorId 中的 buildId 字段
  //       populate: ({ 
  //         path: 'buildId',  // 填充 unitId 中的 buildId 字段
  //         populate: ({
  //           path: 'communityId' // 填充 buildId 中的 communityId 字段
  //         })
  //      }) 
  //     })
  //   });
  //   console.log(houselist[0].floorId.unitId.buildId.communityId._id==id);
  // houselist.forEach((item) => {
  //     if(item.floorId.unitId.buildId.communityId._id==id){
  //       data.push(item)
  //     }
  // })

  // data = houselist
  // let buildlist = await buildlistModel.find({ communityId: id })
  // buildlist.forEach(async (x) => {
  // let unitlist = await unitListModel.find({ buildId: x._id })
  // console.log(unitlist);

  // let unitlist = await unitListModel.find({ buildId: x._id })
  // unitlist.forEach(async (y) => {
  //     let floorlist = await floorListModel.find({ unitId: y._id })
  //     floorlist.forEach(async (z) => {
  //         let houselist = await houseListModel.find({ floorId: z._id })
  //         data.push(houselist)
  //     })
  // })
  // })
  // let create = await communityListModel.create({ communityName: "华安家园" })
  // console.log(data);
  // let craete = await buildlistModel.create({ communityId: id,buildName:"4" })

  // let create = await unitListModel.create({ buildId: "67ca8f2bfd1acf4ace39fd91", name: "3" })

  // let create = await floorListModel.create({ unitId: "67d0db0b518138c671d7946c", floorName: "3" })

  // let cteate = await houseListModel.create({
  //   floorId: "67ca8f8fc7515907ebaa717e",
  //   sqrt: 90.84,
  //   tel: 13473654757,
  //   houseMaster: "赵六",
  //   houseName:"0101010201"
  // })



  try {
    let rsp = await houseListModel
      .aggregate([
        {
          $lookup: {
            from: 'floorlist', // 关联 floorlist 表
            localField: 'floorId',
            foreignField: '_id',
            as: 'floor',
          },
        },
        {
          $unwind: '$floor', // 将 floor 数组展开为对象
        },
        {
          $lookup: {
            from: 'unitlist', // 关联 unitlist 表
            localField: 'floor.unitId',
            foreignField: '_id',
            as: 'unit',
          },
        },
        {
          $unwind: '$unit', // 将 unit 数组展开为对象
        },
        {
          $lookup: {
            from: 'buildlist', // 关联 buildlist 表
            localField: 'unit.buildId',
            foreignField: '_id',
            as: 'build',
          },
        },
        {
          $unwind: '$build', // 将 build 数组展开为对象
        },
        {
          $lookup: {
            from: 'communitylist', // 关联 communitylist 表
            localField: 'build.communityId',
            foreignField: '_id',
            as: 'community',
          },
        },
        {
          $unwind: '$community', // 将 community 数组展开为对象
        },
        {
          $project: {
            tel: 1,
            isIn: 1,
            sqrt: 1,
            houseName: 1,
            houseMaster: 1,
            floorName: '$floor.floorName',
            unitName: '$unit.unitName',
            buildName: '$build.buildName',
            communityName: '$community.communityName',
            xiaoquId: '$community._id',
          },
        },
      ])
    let data = rsp.filter(item => item.xiaoquId == id)
    console.log(data);

    res.send({
      code: 200,
      message: 'housemanage成功',
      data: data
    })
  } catch (error) {
    res.send({
      code: 500,
      message: 'housemanage服务器错误',
      msg: error.message
    })
  }
})

module.exports = router;