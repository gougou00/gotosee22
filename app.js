var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
// _.extend用新对象里的字段替换老的字段
var _ = require('underscore')
var Movie = require('./models/movie')
var bodyParser = require('body-parser')
var port = process.env.PORT || 3000
var app = express()
// 连接mongodb本地数据库
// Mongoose: mpromise (mongoose's default promise library) is deprecated ...
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/gotosee')

app.set('views', './views/pages')
app.set('view engine', 'jade')
// app.use(express.bodyParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
// 载入moment模块，格式化日期
app.locals.moment = require('moment')
app.listen(port)

console.log('gotosee22 started on port ' + port)

// index page
app.get('/', function (req, res) {
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