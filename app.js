var express = require('express')
var path = require('path')
var mongoose = require('mongoose')


var bodyParser = require('body-parser')
// 引入express-session中间件
var session = require('express-session')
// 引入持久化session的中间件
var mongoStore = require('connect-mongo')(session)
var port = process.env.PORT || 3000
var app = express()
var dbUrl = 'mongodb://localhost/gotosee'
var logger = require('morgan')
// 连接mongodb本地
// Mongoose: mpromise (mongoose's default promise library) is deprecated ...
mongoose.Promise = global.Promise
mongoose.connect(dbUrl)

app.set('views', './views/pages')
app.set('view engine', 'jade')
// app.use(express.bodyParser())
app.use(bodyParser.urlencoded({extended: true}))

// express.session可以保存b/s的对话
// 需要express.cookieParser中间件的支持才能工作
// app.use(express.cookieParser())
// express 4.x已分离，不需要cookieParser
// 持久化session
app.use(session({
	secret: 'gotosee',
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
	})
}))

if ('development' === app.get('env')) {
	app.set('showStackError', true)
	app.use(logger(':method :url :status'))
	app.locals.pretty = true
	mongoose.set('debug', true)
}

require('./config/routes')(app)

app.use(express.static(path.join(__dirname, 'public')))
// 载入moment模块，格式化日期
app.locals.moment = require('moment')
app.listen(port)

console.log('gotosee22 started on port ' + port)

