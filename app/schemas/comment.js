// 引入mongoose模块
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId
// 调用mongoose的schema方法
var CommentSchema = new Schema({
	// 当前要评论的电影
	movie: {type: ObjectId, ref: 'Movie'},
	from: {type: ObjectId, ref: 'User'},
	to: {type: ObjectId, ref: 'User'},
	content: String,
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

CommentSchema.pre('save', function (next) {
	// 判断数据是否是新添加的
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
	else {
		this.meta.updateAt = Date.now()
	}

	next()
})

CommentSchema.statics = {
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
module.exports = CommentSchema