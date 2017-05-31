var Category = require('../models/category')

// admin new page
exports.new = function (req, res) {
	res.render('category_admin', {
		title: 'gotosee 后台分类录入页',
		category: {}
	})
}

// admin post movie
exports.save = function (req, res) {
	var _category = req.body.category
	
	var category = new Category(_category)

	category.save(function (err, category) {
		if (err) {
			console.log(err)
		}

		res.redirect('/admin/category/list')
	})
	
}

// category page
exports.list = function (req, res) {
	// 回调函数也要改！！
	Category.fetch(function (err, categories) {
		if (err) {
			console.log(err)
		}

		res.render('categorylist', {
			title: 'gotosee 分类列表页',
			categories: categories
		})
	})
}
