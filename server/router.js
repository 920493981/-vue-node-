const express = require('express')
const router = express.Router()
const db = require('./db')
const check = require('./check')
const checkLogin = check.checkLogin
const checkNotLogin = check.checkNotLogin

//req => request   res => response
// 储存用户名密码
router.post('/api/admin/signup', function (req, res, next) {
  new db.User(req.body.userInfo).save(function (err) {
    if (err) {
      res.status(500).send()
      return
    }
    res.send()
  })
})

// 登录
router.post('/api/admin/signin', function (req, res) {
  var user = req.body.userInfo.name
  var pwd = req.body.userInfo.password
  console.log('name: ' + user + '\n' + "password: " + pwd)
  req.session.user = user
  console.log( 'req.session.user: ' +req.session.user)
  console.log(req.cookies)
  req.cookies.name = user
  console.log('登录的session user信息: ' + req.session.user)

  // console.log('session信息' + req.session)
  console.log('session id: ' + req.session.id)
  
  res.send(req.session.id)
})

// 根据用户名获取用户
router.get('/api/admin/getUser/:name', function (req, res) {
  db.User.findOne({ name: req.params.name }, function (err, docs) {
    if (err) {
      console.error(err)
      return
    }
    console.log(docs)
    res.send(docs)
  })
})

//登出
router.get('/api/logout', function(req, res) {
  
  console.log('这是登出之前的id' + req.session.id + '\n' + '登出之前的user: ' + req.session.user)
  req.session.user = null
  req.session.destroy(function(err) {
    if(err) {console.log('session销毁失败')}
      else {console.log('session被销毁')}
  })
  // console.log('这是登出之后的id' + req.session.id)
        
  res.send()
})


// 获取所有文章
router.get('/api/articleList', function (req, res) {
  console.log('文章页面check-sessionId: '+ req.session.id)

  db.Article.find({}, function (err, docs) {
    if (err) {
      console.error(err)
      return
    }
    // res.json(docs)
    res.send(docs)
  })

})

// 文章详情页
router.get('/api/articleDetail/:id', function (req, res) {
  db.Article.findOne({ _id: req.params.id }, function (err, docs) {
    if (err) {
      console.error(err)
      return
    }
    console.log('详情页跳转')
    res.send(docs)
  })
})

// 文章保存
router.post('/api/admin/saveArticle', function (req, res) {
  new db.Article(req.body.articleInformation).save(function (err) {
    if (err) {
      res.status(500).send()
      return
    }
    console.log('save success')
    res.send()
  })
})

// 文章更新
router.post('/api/admin/updateArticle', function (req, res) {
  let info = req.body.articleInformation
  db.Article.find({_id: info._id}, function (err, docs) {
    if (err) {
      return
    }
    docs[0].title = info.title
    docs[0].date = info.date
    docs[0].content = info.content
    docs[0].gist = info.gist
    docs[0].labels = info.labels
    db.Article(docs[0]).save(function (err) {
      if (err) {
        res.status(500).send()
        return
      }
      console.log( 'update success')
      res.send()
    })
  })
})

// 文章删除
router.post('/api/admin/deleteArticle', function (req, res) {
  db.Article.remove({_id: req.body._id}, function (err) {
    if (err) {
      res.status(500).send()
      return
    }
    console.log('remove success')
    res.send()
  })
})

module.exports = router