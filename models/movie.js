// 加载mongoose工具模块
var mongoose = require('mongoose')
var MovieSchema = require('../schemas/movie')
var Movie = mongoose.model('Movie', MovieSchema)

module.exports = Movie