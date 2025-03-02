const mongoose = require('mongoose')
const { log } = require('node:console')
mongoose.connect('mongodb+srv://qiusheng:Rosedale1314@public-project.avgf0.mongodb.net/job_data').then(res=>{
    console.log('连接成功！');
}).catch(err=>{
    console.log('连接失败！');
})

let userListSchema = new mongoose.Schema({
    username:String,
    password:String
})

let userListModel = new mongoose.model('userlist',userListSchema,'userlist')

module.exports = {
    userListModel
}