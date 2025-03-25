var express = require('express');
var router = express.Router();
const { Base64 } = require('js-base64')
const {
  communityListModel,
  buildlistModel,
  unitListModel,
  floorListModel,
  houseListModel,
  rbacModel
} = require('../db/db')


router.post('/housemanage', async (req, res) => {
  let { id } = req.body

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
    // console.log(data);

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
router.post('/treemanage', async (req, res) => {
  let { id } = req.body
  console.log(id);
  let cname = await communityListModel.find({_id:id})
  let data = []
  let houselist = await houseListModel.find()
    .populate({
      path: 'floorId',
      populate: ({
        path: 'unitId', // 填充 floorId 中的 buildId 字段
        populate: ({
          path: 'buildId',  // 填充 unitId 中的 buildId 字段
          populate: ({
            path: 'communityId' // 填充 buildId 中的 communityId 字段
          })
        })
      })
    });
  for (let i of houselist) {
    if (i.floorId.unitId.buildId.communityId._id == id) {
      data.push(i)
    }
  }
  // console.log(data);
  res.send({
    code: 200,
    message: 'treemanage成功',
    data: {
      data,
      cname
    },
  })
})

// 获取用户列表接口
router.post('/rbaclist', async (req, res) => {
  try {
    let { val } = req.body
    let query = {}
    if (val != '') {
      query.username = { $regex: val }
    }
    // console.log(query);

    let result = await rbacModel.find(query)
    // console.log(result);
    res.send({
      code: 200,
      message: 'rbaclist成功',
      data: result
    })
  } catch (error) {
    res.send({
      code: 500,
      message: 'rbaclist服务器错误',
      msg: error
    })
  }
})

router.post('/rbacad', async (req, res) => {
  await rbacModel.create({
    username: "admain",
    password: 123456,
    role: "超级管理员",
    Permiss: 0,
    content: "超级管理员",
    timeout: Date.now(),
    upname: "admain",
  })
  res.send({
    code: 200,
    message: 'rbacad成功'
  })
})

// 添加用户接口
router.post('/rbacadd', async (req, res) => {
  let { id, username, password, role, Permiss, status, content, timeout, upname, routes } = req.body
  let file = req.body
  let Promiss = await rbacModel.find({ username: upname })
  file.Permiss = Promiss[0].Permiss + 1
  if (id != '') {
    let result = await rbacModel.updateOne({ _id: id }, file)
    res.send({
      code: 200,
      message: '修改成功',
    })
  } else {
    console.log(file);
    let result = await rbacModel.create(file)
    res.send({
      code: 200,
      message: '添加成功',
    })
  }
})

// 删除用户接口
router.post('/rbacdel', async (req, res) => {
  try {
    let { id } = req.body
    // console.log(id);
    let result = await rbacModel.deleteOne({ _id: id })
    res.send({
      code: 200,
      message: '删除成功',
    })
  } catch (error) {
    res.send({
      code: 500,
      message: '删除失败',
      msg: error
    })
  }
})

// 编辑用户接口
router.post('/rbacedit', async (req, res) => {
  let { id, status } = req.body
  // console.log(req.body);

  let result = await rbacModel.findByIdAndUpdate({ _id: id }, { status: !status })
  res.send({
    code: 200,
    message: '修改成功  ',
  })
})
module.exports = router;