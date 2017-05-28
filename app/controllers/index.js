var Movie = require('../models/movie')
// index page
exports.index = function (req, res) {
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
}
