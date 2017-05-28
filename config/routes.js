var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Movie = require('../app/controllers/movie')
// _.extend用新对象里的字段替换老的字段
var _ = require('underscore')

module.exports = function(app) {
	// pre handle user
	app.use(function (req, res, next) {
		var _user = req.session.user
		app.locals.user = _user
		// if (_user) {
		// 	app.locals.user = _user
		// }
		next()
	})

	// Index
	app.get('/', Index.index)

	// User
	app.post('/user/signup', User.signup)
	app.post('/user/signin', User.signin)
	app.get('/signin', User.showSignin)
	app.get('/signup', User.showSignup)
	app.get('/logout', User.logout)
	app.get('/admin/userlist', User.list)


	// Movie
	app.get('/movie/:id', Movie.detail)
	// app.get('/admin/movie', Movie.new)
	app.get('/admin/new', Movie.new)
	app.get('/admin/update/:id', Movie.update)
	// app.post('/admin/movie/new', Movie.save)
	app.post('/admin/movie', Movie.save)
	app.get('/admin/list', Movie.list)
	app.delete('/admin/list', Movie.del)
	
}
