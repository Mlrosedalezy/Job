var express = require('express');
var router = express.Router();
const {
  communityListModel,
} = require('../db/db')

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/userlist',async function(req, res, next) {
  try {
    res.send({
      mes:"ok",
      code:200
    })
    } catch (error) {
      res.send({ message: "用户获取错误", code: 500 })
    }
  });
// layout
router.post('/getlayout',async function(req, res, next) {
  try {
    let {id} = req.body
    let data = await communityListModel.find()
    res.send({
      mes:"ok",
      code:200,
      data
    })
  } catch (error) {
    res.send({message:"获取错误",code:500})
  }
})

// 工作台
router.post('/workbench',async function(req, res, next) {
  let { id } = req.body
  try {
    let data = await communityListModel.find({_id:id})
    res.send({
      mes:"ok",
      code:200,
      data:data[0]
    })
  } catch (error) {
    res.send({message:"用户获取错误",code:500})
  }
});


module.exports = router;
