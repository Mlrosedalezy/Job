const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://qiusheng:Rosedale1314@public-project.avgf0.mongodb.net/job_data').then(res=>{
    console.log('连接成功！');
}).catch(err=>{
    console.log('连接失败！');
})

let userListSchema = new mongoose.Schema({
    username:String,
    password:String     
})

// 小区表
let communitySchema = new mongoose.Schema({
    communityName:String,
})
// build表
let buildSchema = new mongoose.Schema({
    buildName:String,
    communityId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'communitylist'
    }
})
// unit表
let unitSchema = new mongoose.Schema({
    unitName:String,
    buildId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'buildlist'
    }
})
// floor表
let floorSchema = new mongoose.Schema({
    floorName:String,
    unitId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'unitlist'
    }
})
// house表
let houseSchema = new mongoose.Schema({
    houseName:String,
    floorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'floorlist'
    },
    sqrt:Number,
    tel:Number,
    isIn:{
        type:Boolean,
        default:false
    },
    houseMaster:String,
})

let communityListModel = new mongoose.model('communitylist',communitySchema,'communitylist')
let buildlistModel = new mongoose.model('buildlist',buildSchema,'buildlist')
let unitListModel = new mongoose.model('unitlist',unitSchema,'unitlist')
let floorListModel = new mongoose.model('floorlist',floorSchema,'floorlist')
let houseListModel = new mongoose.model('houselist',houseSchema,'houselist')
let userListModel = new mongoose.model('userlist',userListSchema,'userlist')

module.exports = {
    userListModel,
    communityListModel,
    buildlistModel,
    unitListModel,
    floorListModel,
    houseListModel
}