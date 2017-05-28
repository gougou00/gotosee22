var express = require('express')
var path = require('path')
var mongoose = require('mongoose')

// _.extend用新对象里的字段替换老的字段
var _ = require('underscore')
var Movie = require('./models/movie')
var User = require('./models/user')
var bodyParser = require('body-parser')
// 引入express-session中间件
var session = require('express-session')
// 引入持久化session的中间件
var mongoStore = require('connect-mongo')(session)
var port = process.env.PORT || 3000
var app = express()
var dbUrl = 'mongodb://localhost/gotosee'
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

app.use(express.static(path.join(__dirname, 'public')))
// 载入moment模块，格式化日期
app.locals.moment = require('moment')
app.listen(port)

console.log('gotosee22 started on port ' + port)

// index page
app.get('/', function (req, res) {
	console.log('user in session: ')
	console.log(req.session.user)
	Movie.fetch(function (err, movies) {
		if (err) {
			console.log(err)
		}
		res.render('index', {
			title: 'gotosee 首页',
			movies: movies
			// movies: [{
			// 	title: 'momocha',
			// 	_id: 1,
			// 	poster: 'http://p5.7k7kimg.cn/m/201703/0109/107-1F3010932360-L.jpg'
			// },{
			// 	title: 'momocha',
			// 	_id: 2,
			// 	poster: 'http://p5.7k7kimg.cn/m/201703/0109/107-1F3010932360-L.jpg'
			// }]
		})
	})
})

// signup
app.post('/user/signup', function(req, res) {
	var _user = req.body.user
	// console.log(_user)
	
	User.findOne({name: _user.name}, function (err, user) {
		if (err) {
			console.log(err)
		}
		if (user) {
			return res.redirect('/')
		}
		else {
			var user = new User(_user)

			user.save(function(err, user) {
				if (err) {
					console.log(err)
				}
				console.log('成功了呢!')
				// 成功后返回用户列表页
				res.redirect('/admin/userlist')
			})
		}
	})
})

// signin
app.post('/user/signin', function (req, res) {
	var _user = req.body.user
	var name = _user.name
	var password = _user.password
	User.findOne({name: name}, function (err, user) {
		if (err) {
			console.log(err)
		}

		if (!user) {
			// console.log("hehe")
			return res.redirect('/')
		}

		user.comparePassword(password, function (err, isMatch) {
			if (err) {
				console.log(err)
			}

			if (isMatch) {
				// console.log('Password is matched!')
				req.session.user = user
				return res.redirect('/')
			}
			else {
				console.log('Password is not matched!')
			}
		})
	})
})

// userlist page
app.get('/admin/userlist', function (req, res) {
	User.fetch(function (err, users) {
		if (err) {
			console.log(err)
		}

		res.render('userlist', {
			title: 'gotosee 用户列表页',
			users: users
		})
	})
})

// admin page
app.get('/admin/movie', function (req, res) {
	res.render('admin', {
		title: 'gotosee 后台录入页',
		movie: {
			title: '',
			director: '',
			country: '',
			year: '',
			poster: '',
			flash: '',
			summary: '',
			language: ''
		}
	})
})

// admin update movie
app.get('/admin/update/:id', function (req, res) {
	var id = req.params.id

	if (id) {
		Movie.findById(id, function (err, movie) {
			res.render('admin', {
				title: 'gotosee 后台更新页',
				movie: movie
			})
		})
	}
})

// admin post movie
app.post('/admin/movie/new', function (req, res) {
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie

	if (id !== 'undefined') {
		Movie.findById(id, function (err, movie) {
			if (err) {
				console.log(err)
			}
			// 用新对象里的字段替换老的字段
			_movie = _.extend(movie, movieObj)
			_movie.save(function (err, movie) {
				if (err) {
					console.log(err)
				}

				res.redirect('/movie/' + movie._id)
			})
		})
	}
	else {
		// 新加电影
		_movie = new Movie({
			director: movieObj.director,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		})

		_movie.save(function (err, movie) {
			if (err) {
				console.log(err)
			}

			res.redirect('/movie/' + movie._id)
		})
	}
})

// detail page
app.get('/movie/:id', function (req, res) {
	var id = req.params.id

	Movie.findById(id, function (err, movie) {
		res.render('detail', {
			title: 'gotosee ' + movie.title,
			movie: movie
			// movie: {
			// 	director: 'momocha',
			// 	country: '中国',
			// 	title: 'xiarimomocha',
			// 	year: 2017,
			// 	poster: 'http://p5.7k7kimg.cn/m/201703/0109/107-1F3010932360-L.jpg',
			// 	language: 'english',
			// 	flash: 'http://player.youku.com/player.php/sid/XMTY0NzYwNjI0MA==/v.swf',
			// 	summary: 'good game'
			// }
		})
	})
})

// list page
app.get('/admin/list', function (req, res) {
	Movie.fetch(function (err, movies) {
		if (err) {
			console.log(err)
		}

		res.render('list', {
			title: 'gotosee 列表页',
			movies: movies
			// movies: [{
			// 	title: 'xiarimomocha',
			// 	_id: 1,
			// 	director: 'momocha',
			// 	country: '中国',
			// 	year: 2017,
			// 	// poster: 'http://p5.7k7kimg.cn/m/201703/0109/107-1F3010932360-L.jpg',
			// 	language: 'english',
			// 	flash: 'http://player.youku.com/player.php/sid/XMTY0NzYwNjI0MA==/v.swf',
			// 	// summary: 'good movie'
			// }]
		})
	})
})


// list delete movie
app.delete('/admin/list', function (req, res) {
	var id = req.query.id

	if (id) {
		Movie.remove({_id: id}, function (err, movie) {
			if (err) {
				console.log(err)
			}
			else {
				res.json({success: 1})
			}
		})
	}
})