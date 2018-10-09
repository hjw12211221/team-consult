const config = {}
config.basePostData = {
	random: '1234',
	spid: '1001',
	channel: '23',
	format: 'JSON',
	oper: '127.0.0.1',
	sign: '3f52f63fad63c5dd209d28420977fb5d'
}
config.name = 'doc_'
// 点点医生
if (config.name === 'doc_') {
	config.AppID = 'wx350294e57d85e10d'
	config.wxid = 'wxfc623ff79ce99489'
	// config.name = 'doc_'
	config.HOST = 'https://ddys-book.diandianys.com/app' // 正式
	config.baseApi = 'https://ddys-base.diandianys.com/app' // 正式
	config.loginURL = 'https://ddys-wechat.diandianys.com/WeChat/consult-team/#/loginHome?callback='
	// config.loginURL = location.origin + location.pathname + '#/loginHome?callback='
} else if (config.name === 'docTest_') {
	config.AppID = 'wx33b1da8486ed4cd2'
	config.wxid = 'wxfc623ff79ce99489'
	config.HOST = 'http://yyddysws.hztywl.cn/app' // 测试
	config.baseApi = 'http://test-ddys-base.hztywl.cn/app' // 测试
	// config.loginURL = 'http://test-ddys-wechat.hztywl.cn/WeChat/consult-team/#/loginHome?callback='
	config.loginURL = location.origin + location.pathname + '#/loginHome?callback='
}
config.getVal = function (name) {
	var db = window.localStorage
	return JSON.parse(db.getItem(config.name + name))
}
config.getQstr = function (name) {
	var reg = new RegExp('' + name + '=([^&]+?)(#|&|$)', 'i')
	var url = window.location.href
	var index = url.indexOf('?')
	var r = url.substr(index).match(reg)
	if (r != null) return unescape(r[1])
	return null
}
config.sqr = function (name) {
	var reg = new RegExp('' + name + '=([^&]+?)(#|&|$)', 'i')
	var url = window.location.href
	var index = url.indexOf('?')
	var r = url.substr(index).match(reg)
	if (r != null) return decodeURI(r[1])
	return null
}

if (config.getQstr('clickLocation') && config.getVal('weChat')) {
	config.basePostData.clickLocation = config.getQstr('clickLocation')
}
export default config
