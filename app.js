const express = require('express')
const fs = require('fs')
const path = require('path')
const bodyParse = require('body-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const cookieParser = require('cookie-parser')
const router = require('./server/router')
const app = express()

const resolve = file => path.resolve(__dirname, file)

//网页cookie记录时间
const maxAge = 2592000000

//2592000000
app.use(bodyParse.json())//顺序变动
app.use(bodyParse.urlencoded({ extended: false }))

app.use('/dist', express.static(resolve('./dist')))
app.use(cookieParser())



// session 与服务器交流信道
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'blog',
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: '/',
    secure: false,
    maxAge: maxAge
  },
  store: new MongoStore({
    url: 'mongodb://localhost:27017/blog'
  })
}))
//路由
app.use(router)
app.get('*', function (req, res) {
  let html = fs.readFileSync(resolve('./' + 'index.html'), 'utf-8')
  res.send(html)
})




app.listen(3000, function () {
  console.log('访问地址为 localhost:3000')
})