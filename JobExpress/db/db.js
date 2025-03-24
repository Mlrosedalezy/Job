const mongoose = require('mongoose')


mongoose.connect('mongodb+srv://qiusheng:Rosedale1314@public-project.avgf0.mongodb.net/job_data').then(res=>{
    console.log('连接成功！');
}).catch(err=>{
    console.log('连接失败！');
})

let userListSchema = new mongoose.Schema({
    username:String,
    password:String,
    tel:String,
    img:String
})

// 用户模型
const userTenementSchema = new mongoose.Schema({
    userName:{ type: String, required: true ,default:"未命名用户"},
    phoneNumber: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    verificationCode: String,
    verificationCodeExpires: Date,
    role: [{ type: String, default: 'user' }], // 添加角色字段 user:用户 tenement:物业 admin:管理员
    name: String,
    avatar: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,
    loginAttempts: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isAuthenticated:{ type: Boolean, default: false }
  });

// 添加更新时间戳的中间件
userTenementSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });


// 路由表

const RoutingFormSchema = new mongoose.Schema({
    RoutingName:{ type: String, required: true },
    RoutingChildren:[{type:mongoose.Schema.Types.ObjectId,ref:'RoutingChildren'}]
        
})

const RoutingChildrenSchema = new mongoose.Schema({
    routerName:{ type: String, required: true },
    routerPath:{ type: String, required: true }
})

// 通行二维码模型
const QrCodeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true, enum: ['出', '入'] },
    description: { type: String, maxlength: 50 ,default:"出入平安"},
    status: { type: String, default: 'unused' }, // 添加状态字段，默认为未使用
    validityPeriod: { type: String, enum: ['segment', 'permanent'], default: 'permanent' }, // 有效期类型：时段或永久
    startDate: { type: Date ,default: Date.now()}, // 开始日期
    endDate: { type: Date,default: Date.now() }, // 结束日期
    totalTimes: { type: Number, default: 0 }, // 总次数
    unlimitedTimes: { type: Boolean, default: false }, // 是否不限次
    usageLimitDays: { type: Number ,default:1}, // 每X天
    usageLimitIn: { type: Number, default: 0 }, // 进入次数限制
    usageLimitOut: { type: Number, default: 0 }, // 出入次数限制
    unlimitedUsage: { type: Boolean, default: false }, // 是否不限制使用次数
    enabled: { type: Boolean, default: true }, // 启用状态
    userlist:{ type:mongoose.Schema.Types.ObjectId, ref: 'userlist'},
    userTenement:{ type:mongoose.Schema.Types.ObjectId, ref: 'userTenement'}
});

let QrCodeModel = mongoose.model('QrCode', QrCodeSchema, 'qrcodes');


let RoutingFormModel = mongoose.model('RoutingForm', RoutingFormSchema, 'RoutingForm');
let RoutingChildrenModel = mongoose.model('RoutingChildren', RoutingChildrenSchema, 'RoutingChildren');
let userTenementModel = mongoose.model('userTenement', userTenementSchema, 'userTenement');
let userlistModel = mongoose.model("userlist",userListSchema,"userlist")

module.exports = {
    userlistModel,
    userTenementModel,
    RoutingChildrenModel,
    RoutingFormModel,
    QrCodeModel
}