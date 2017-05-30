var Movie = require('../models/movie')
var Comment = require('../models/comment')
// _.extend用新对象里的字段替换老的字段
var _ = require('underscore')

// detail page
exports.detail = function (req, res) {
	var id = req.params.id

	Movie.findById(id, function (err, movie) {
		Comment
			.find({movie: id})
			.populate('from', 'name')
			.populate('reply.from reply.to', 'name')
			.exec(function(err, comments) {
				console.log(comments)
				res.render('detail', {
					title: 'gotosee 详情页',
					movie: movie,
					comments: comments
				})
			})
	})
}

// admin new page
// app.get('/admin/movie', function (req, res) {
exports.new = function (req, res) {
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
}

// admin update movie
exports.update = function (req, res) {
	var id = req.params.id

	if (id) {
		Movie.findById(id, function (err, movie) {
			res.render('admin', {
				title: 'gotosee 后台更新页',
				movie: movie
			})
		})
	}
}

// admin post movie
// app.post('/admin/movie/new', function (req, res) {
exports.save = function (req, res) {
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
			language: movieObj.language,
			country: movieObj.country,
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
}



// list page
exports.list = function (req, res) {
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
}


// list delete movie
exports.del = function (req, res) {
	var id = req.query.id

	if (id) {
		Movie.remove({_id: id}, function (err, movie) {
			if (err) {
				console.log(err)
				res.json({success: 0})
			}
			else {
				res.json({success: 1})
			}
		})
	}
}