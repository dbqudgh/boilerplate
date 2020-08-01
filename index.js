const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const {
    User
} = require('./models/User')


//application
app.use(bodyParser.urlencoded({
    extended: true
}))
//application/json
app.use(bodyParser.json())



mongoose.connect('mongodb+srv://dbqudgh:qwer1313@cluster0.vdboo.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('MongoDb Connected...')
}).catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World!~~안녕하세요'))


app.post('/register', (req, res) => {

    //회원 가입 할때 필요한 정보들을 client에서 가져오면
    //그것들을 데이터 베이스에 넣어준다

    //app에서 body parser 해줘서 클라이언트에서 응답받은걸 사용가능
    const user = new User(req.body)



    user.save((err, userInfo) => {
        if (err) return res.json({
            success: false,
            err
        })
        return res.status(200).json({
            success: true
        })
    })



})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))