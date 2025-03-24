var express = require('express');
var router = express.Router();
const {

} = require('../db/db')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/userlist',async function(req, res, next) {
  try {
    res.send({
      mes:"ok",
      code:200
    })
  } catch (error) {
    res.send({message:"用户获取错误",code:500})
  }
});


module.exports = router;
