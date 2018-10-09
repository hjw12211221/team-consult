import bookApi from './bookApi.js'
import config from './config.js'
const util = {
	...config
}
util.getInfo = function (info) {
	info = util.name + info
	if (localStorage.getItem(info) == '' || localStorage.getItem(info) == null) {
		return false
	} else {
		const data = localStorage.getItem(info)
		if (data.patientCardNo) {
			data.patientAge = new Date().getFullYear() - data.patientCardNo.substring(6, 10)
		} else {
			data.patientAge = 0
		}
		return data
	}
}

util.setVal = function (name, value) {
	var db = window.localStorage
	db.setItem(util.name + name, JSON.stringify(value))
}
util.getCache = (name) => {
	name = util.name + name
	var db = window.sessionStorage
	return JSON.parse(db.getItem(name))
}

util.setCache = (name, value) => {
	name = util.name + name
	var db = window.sessionStorage
	db.setItem(name, JSON.stringify(value))
}
util.remove = (name) => {
	var db = window.localStorage
	db.removeItem(util.name + name)
}
util.runToLogin = (path, that) => {
	if (!util.getVal('docInfo')) {
		util.setVal('redirect', path)
		that.$router.push(`/loginHome`)
	} else {
		that.push(path)
	}
}
util.hintIsModal = (msg, val) => {
	val.$store.commit('setHint', {
		status: true,
		val: msg
	})
	setTimeout(function () {
		val.$store.commit('setHint', {
			status: false,
			val: ''
		})
	}, 2000)
}

// 设置title
util.setTitle = function (t) {
	document.title = t
	var i = document.createElement('iframe')
	i.src = ''
	i.style.display = 'none'
	i.onload = function () {
		setTimeout(function () {
			i.remove()
		}, 9)
	}
	document.body.appendChild(i)
}

util.cardNoAge = function (CardNo) {
	return new Date().getFullYear() - CardNo.substring(6, 10)
}
util.strConceal = function (str) {
	if (str.length > 7) {
		var start = str.substring(0, 3)
		var stop = str.substring(str.length - 4, str.length)
		var content = str.substring(3, str.length - 4)
		var contents = content.replace(/./g, '*')
		str = start + contents + stop
		return str
	} else {
		return str
	}
}
util.Sex = function (num) {
	if (num == 1) {
		return '男'
	} else if (num == 2) {
		return '女'
	} else {
		return ''
	}
}
util.consultState = function (type) {
	switch (type) {
	case '0':
		return '正在咨询'
	case '1':
		return '已回复'
	case '2':
		return '已完成'
	case '3':
		return '已取消'
	}
}
util.trim = function (str, type) {
	if (type === 'n') {
		return str.replace(/[\n]/ig, '')
	} else if (type === 's') {
		return str.replace(/(^\s*)|(\s*$)/g, '')
	}
}
util.formatDate = function (now, state) {
	var year = now.getFullYear()
	var month = now.getMonth() + 1
	var date = now.getDate()
	var hour = now.getHours()
	var minute = now.getMinutes()
	var second = now.getSeconds()
	if (month < 10) {
		month = '0' + month
	}
	if (date < 10) {
		date = '0' + date
	}
	if (hour < 10) {
		hour = '0' + hour
	}
	if (minute < 10) {
		minute = '0' + minute
	}
	if (second < 10) {
		second = '0' + second
	}
	if (state == 1) {
		return year + '-' + month + '-' + date + ' ' + hour + ':' + minute
	} else if (state == 2) {
		if (new Date(now).toDateString() === new Date().toDateString()) {	// 获得日期，并且判断是否是今天
			return hour + ':' + minute
		} else if (new Date(now) < new Date()) {
			return month + '-' + date + ' ' + hour + ':' + minute
		}
	} else if (state == 3) {
		return month + '-' + date
	} else if (state == 4) {
		return month + '-' + date + ' ' + hour + ':' + minute
	} else if (state == 5) {
		return year + '年' + (+month) + '月' + (+date) + '日'
	} else {
		return year + '-' + month + '-' + date
	}
}

util.week = function (number) {
	switch (number) {
	case 1:
		return '周一'
	case 2:
		return '周二'
	case 3:
		return '周三'
	case 4:
		return '周四'
	case 5:
		return '周五'
	case 6:
		return '周六'
	default:
		return '周日'
	}
}

//   添加浏览器前缀

let elementStyle = document.createElement('div').style
let vendor = (() => {
	let transformNames = {
		webkit: 'webkitTransform',
		Moz: 'MozTransform',
		O: 'OTransform',
		ms: 'msTransform',
		standard: 'transform'
	}

	for (let key in transformNames) {
		if (elementStyle[transformNames[key]] !== undefined) {
			return key
		}
	}

	return false
})()
util.prefixStyle = function (style) {
	if (vendor === false) {
		return false
	}

	if (vendor === 'standard') {
		return style
	}

	return vendor + style.charAt(0).toUpperCase() + style.substr(1) //  将第一个字母大写
}

// 分享
util.jssdk = function (share) {
	var _this = this
	bookApi('ddyy.system.wechat.jsapiticket.get', {
		appid: util.wxid,
		reqUrl: share.link
	}, '2').then((res) => {
		var config = res.data.obj
		wx.config(config)
		wx.ready(function () {
			console.log('成功')
			// 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
			wx.onMenuShareTimeline({
				title: share.title, // 分享标题
				link: share.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: share.imgUrl, // 分享图标
				success: function () {
					// 用户确认分享后执行的回调函数
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
				}
			})
			console.log(share.desc)
			// 获取“分享给朋友”按钮点击状态及自定义分享内容接口
			wx.onMenuShareAppMessage({
				title: share.title, // 分享标题
				desc: share.desc, // 分享描述
				link: share.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: share.imgUrl, // 分享图标
				type: 'link', // 分享类型,music、video或link，不填默认为link
				dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				success: function () {
					// 用户确认分享后执行的回调函数
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
				}
			})
			// 获取“分享到QQ”按钮点击状态及自定义分享内容接口
			wx.onMenuShareQQ({
				title: share.title, // 分享标题
				desc: share.desc, // 分享描述
				link: share.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: share.imgUrl, // 分享图标
				success: function () {
					// 用户确认分享后执行的回调函数
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
				}
			})
			// 获取“分享到QQ空间”按钮点击状态及自定义分享内容接口
			wx.onMenuShareQZone({
				title: share.title, // 分享标题
				desc: share.desc, // 分享描述
				link: share.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: share.imgUrl, // 分享图标
				success: function () {
					// 用户确认分享后执行的回调函数
				},
				cancel: function () {
					// 用户取消分享后执行的回调函数
				}
			})
		})
		wx.error(function (res) {
			// util.jssdk(share)
			// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
		})
	})
}
util.initData = () => {
	var URI = window.location.href
	var REDIRECT_URI = encodeURIComponent(URI)
	var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + util.wxid + '&redirect_uri=' + REDIRECT_URI + '&response_type=code&scope=snsapi_userinfo&state=STATE&component_appid=' + util.AppID + '&#wechat_redirect'
	if (window.navigator.userAgent.toLocaleLowerCase().indexOf('micromessenger') >= 0) {
		var code = util.sqr('code')
		// alert(decodeURIComponent(window.location.href))
		// alert(code)
		if (code) {
			bookApi('ddyy.book.user.login.mpwechat', {
				code: code,
				appId: util.wxid
			}).then((res) => {
				if (res.data.code == 0) {
					util.setVal('weChat', res.data.obj)
					location.replace(URI)
				} else {
					// alert(JSON.stringify(res.data))
					location.href = url
				}
			})
		} else {
			// alert('没有code')
			location.href = url
		}
	} else {
		// if (util.getQstr('debug') == 1) {
		// 不用微信打开
		// var appUser = {
		// 	'createTime': 1490327245417,
		// 	// "openid": "o_DBNt1iDJea_JgpWUrxwxzOQWG4",
		// 	'openid': 'o7ZJjv95-qwVSpKeJ5OewBS_L3cM',
		// 	'userAreaname': '中国 湖北 潜江',
		// 	'userAvatar': 'http://wx.qlogo.cn/mmopen/o8hX2eDaLnSLx780DXgj1s71HOWPtdMEhExtA5NtHZBEXorQ3pa7OhR1NY9OmW3KL7G1Z4kW8QOf0ySyZG8qHHNIYX1tXfYP/0',
		// 	'userId': 15,
		// 	'userNickname': '请勿打扰',
		// 	'userSex': '1'
		// }
		// util.setVal('weChat', appUser)
		// }
		// location.href = url
	}
}

// 按虚岁算
util.getAge = (strBirthday) => {
	let returnAge
	let strBirthdayArr = strBirthday.split('-')
	let birthYear = strBirthdayArr[0]
	let birthMonth = strBirthdayArr[1]
	let birthDay = strBirthdayArr[2]
	let d = new Date()
	let nowYear = d.getFullYear()
	let nowMonth = d.getMonth() + 1
	let nowDay = d.getDate()

	if (nowYear == birthYear) {
		returnAge = 1 // 同年 则为0岁
	} else {
		let ageDiff = nowYear - birthYear // 年之差
		if (ageDiff > 0) {
			if (nowMonth == birthMonth) {
				let dayDiff = nowDay - birthDay // 日之差
				if (dayDiff < 0) {
					returnAge = ageDiff
				} else {
					returnAge = ageDiff + 1
				}
			} else {
				let monthDiff = nowMonth - birthMonth // 月之差
				if (monthDiff < 0) {
					returnAge = ageDiff
				} else {
					returnAge = ageDiff + 1
				}
			}
		} else {
			returnAge = -1 // 返回-1 表示出生日期输入错误 晚于今天
		}
	}
	return returnAge // 返回周岁年龄
}

// 算具体年龄，返回一个对象 例:{age, month, day}
util.distanceBirth = (birth) => {
	// https://www.cnblogs.com/sheqiuluo/p/6890300.html 用js获取当前月份的天数
	function mGetDate (year, month) {
		var d = new Date(year, month, 0)
		return d.getDate()
	}
	const date = new Date()
	let age = date.getFullYear() - birth.getFullYear()
	let month = date.getMonth() - birth.getMonth()
	let day = date.getDate() - birth.getDate()
	// 出生日期晚于当天返回null
	if (birth >= date) return null
	// 比较天数
	if (day < 0) {
		month--
		day = mGetDate(date.getFullYear(), date.getMonth()) + day
	}
	// 比较月份
	if (month < 0) {
		month = 12 + month
		age--
	}
	return { age, month, day }
}

// 用范围初始化数组
util.initializeArrayRange = (end, start = 0) => {
	return Array.apply(null, Array(end - start)).map((v, i) => util.zeroize(i + start))
}

// 不满10补零
util.zeroize = (num) => {
	if (num < 10) {
		return `0${num}`
	}
	return num + ''
}

util.makeDateTime = (year, month, day) => {
	let str = ''
	if (year) {
		str += year + '岁'
	}
	if (month) {
		str += month + '月'
	}
	if (day) {
		str += day + '天'
	}
	return str && `（${str}）`
}

util.brthDate = (m, d) => {
	const today = new Date()
	const year = today.getFullYear()
	const month = today.getMonth() + 1
	const date = today.getDate()
	let byear = year
	// 计算今年生日是否过完，过完就算明年生日了
	if (m < month || (m == month && d <= date)) {
		byear++
	}

	const brthday = new Date(byear + '/' + m + '/' + d)

	// 核心，两个日期相减，得到一个整数，是两个日期之间相差的毫秒数
	const dms = brthday - today
	// 毫秒除以1000得到秒，除以3600得到小时，除以24得到日
	return Math.ceil(dms / (1000 * 3600 * 24))
}
util.setValLogin = function (value) {
	var db = window.localStorage
	db.setItem('ddys_userInfo', JSON.stringify(value))
	db.setItem('ddhy_userInfo', JSON.stringify(value))
	db.setItem('ddysTest_userInfo', JSON.stringify(value))
	db.setItem('other_userInfo', JSON.stringify(value))
	db.setItem('login_userInfo', JSON.stringify(value))
}
util.removeVal = function (name) {
	sessionStorage.removeItem(util.name + name)
}
util.getBanknum = function (str) {
	var leng = str.length
	return '**** **** ****' + str.slice(leng - 4)
}
util.initWxConfig = async () => {
	const res = await getConfig({
		appid: util.wxid,
		reqUrl: window.location.href
	})
	if (res.data.code === '0') {
		wx.config(res.data.obj)
	}
}
export default util
