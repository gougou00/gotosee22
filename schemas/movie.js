// 引入mongoose模块
var mongoose = require('mongoose')
// 调用mongoose的schema方法
var MovieSchema = new mongoose.Schema({
	director: String,
	title: String,
	language: String,
	country: String,
	summary: String,
	flash: String,
	poster: String,
	year: Number,
	// 操作数据的时间记录
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})

MovieSchema.pre('save', function (next) {
	// 判断数据是否是新添加的
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
	else {
		this.meta.updateAt = Date.now()
	}

	next()
})

MovieSchema.statics = {
	fetch: function (cb) {
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById: function (id, cb) {
		return this
			.findOne({_id: id})
			.exec(cb)
	}
}

// 导出模式
module.exports = MovieSchema