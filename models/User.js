const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

// 유저 모델에 저장하기 전에 무엇을 한다 fucntion 을 줘서 이게 다 끝나면 다음기능 실행
userSchema.pre('save', function (next) {

    var user = this;
    //비밀번호를 변경한다면
    if (user.isModified('password')) {

        //비밀번호를 암호화 한다

        //aaltRounds 를 받아서 암호화를 한다
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            //유저 password를 넣고 salt를 넣어서 암호화 hash는 암호화 해준 페스워드
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)

                //password 변경
                user.password = hash
                next()
            })
        })


    }else{
        next()
    }

})


userSchema.methods.comparePassword = function(plainPassword,cb){
    //plainPassword 1234567 <이것도 암호화 하여 db에 있는 정보와 같은지 확인  암호화된 비밀번호 $2b$10$WwmdzczrWC0cthdQhyV6mO4BISxU9WRnMDv78jQClmKOpiXDDk8Q6
    bcrypt.compare(plainPassword,this.password,function(err,isMatch){
        if(err) return cb(err)
        cb(null,isMatch) //isMatch true
    })   
}

userSchema.methods.generateToken = function(cb){
    //jsonwebtoken 이용하여 token 생성하기

    var user = this;

    //유저 아이디 + ST 하여 토큰 생성하기
    var token = jwt.sign(user._id.toHexString(),'ST')
    
    user.token = token

    user.save((function(err,user){
        if(err)return cb(err)
        cb(null,user)
    }))
}

userSchema.statics.findByToken = function( token, cb){
    var user = this
    
    //토큰을 decode한다
    jwt.verify(token,'ST',function(err,decoded){
        //유저아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가저온 token과 db에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id":decoded, "token":token},function(err,user){
            if(err) return cb(err)
            cb(null,user)
        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = {
    User
}