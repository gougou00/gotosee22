// 引入mongoose模块
var mongoose = require('mongoose')
// bcrypt-nodejs
var bcrypt = require('bcrypt-nodejs')
var SALT_WORK_FACTOR = 10
// 调用mongoose的schema方法
var UserSchema = new mongoose.Schema({
	name: {
		unique: true,
		type: String
	},
	password: String,
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

UserSchema.pre('save', function (next) {
	var user = this
	// 判断数据是否是新添加的
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
	else {
		this.meta.updateAt = Date.now()
	}

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err)
		// bcrypt-nodejs中hash方法有四个参数
		// API: hash(data, salt, progress, cb)
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) return next(err)

			user.password = hash
			next()
		})
	})
})

UserSchema.methods = {
	comparePassword: function(_password, cb) {
		// bcrypt-nodejs中compare方法有三个参数
		// API: compare(data, encrypted, cb)
		bcrypt.compare(_password, this.password, function(err, isMatch) {
			if (err) return cb(err)

			cb(null, isMatch)
		})
	}
}

UserSchema.statics = {
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
module.exports = UserSchema