import Vue from 'vue'
import Vuex from 'vuex'
import config from '../configs/config.js'
import util from '../configs/util.js'
Vue.use(Vuex)
const state = {
	count: 0,
	isLoding: true,
	isShow: false,
	content: null
}
const mutations = {
	setHint (state, { val, hideCallback }) {
		state.isShow = true
		state.content = val
		setTimeout(() => {
			state.isShow = false
			state.content = null
			hideCallback && hideCallback()
		}, 2000)
	},
	change (state, options) {
		for (var x in options) {
			state[x] = options[x]
		}
	},
	jumpTo (state, direction) { // 全局跳转测试、正式替换
		var options = {
			name: '预约挂号', //	去向的项目名
			goToType: 'link', //	link 直跳链接  router 通过获取location.origin+location.pathname+hash
			hash: '', //	goToType为 'router'时必传
			loginState: ''
		}
		for (var x in direction) {
			options[x] = direction[x]
		}
		var locationArray = [{
			name: '预约挂号',
			testLink: 'http://guahao.zj186.com/WeChat/ddysTest-yygh/#/bookHosList/330100',
			officialLink: 'http://guahao.zj186.com/WeChat/ddys-yygh/#/bookHosList/330100',
			ddhyLink: 'http://guahao.zj186.com/WeChat/ddhy-yygh/#/bookHosList/330100'
		}, {
			name: '查报告单',
			testLink: 'https://ddys-wechat.diandianys.com/WeChat/select-report/#/',
			officialLink: 'https://ddys-wechat.diandianys.com/WeChat/select-report/#/',
			ddhyLink: 'https://ddys-wechat.diandianys.com/WeChat/select-report/#/'
		}, {
			name: '名医号',
			testLink: 'http://weixin.wowys.com/HTML/woys.html#/myh',
			officialLink: 'http://weixin.wowys.com/HTML/woys.html#/myh',
			ddhyLink: 'http://weixin.wowys.com/HTML/woys.html#/myh'
		}, {
			name: '问医生',
			testLink: 'http://test-ddys-wechat.hztywl.cn/WeChat/consult/#/home',
			officialLink: 'https://ddys-wechat.diandianys.com/WeChat/new-consult/#/home',
			ddhyLink: 'https://ddys-wechat.diandianys.com/WeChat/ddhy/consult/#/home'
		}, {
			name: '体检预约',
			testLink: 'http://test-ddys-wechat.hztywl.cn/WeChat/medical-test/#/home',
			officialLink: 'https://ddys-wechat.diandianys.com/WeChat/medical/#/home',
			ddhyLink: 'https://ddys-wechat.diandianys.com/WeChat/ddhy/medical/#/home'
		}, {
			name: '健康百科',
			testLink: 'https://ddys-wechat.diandianys.com/WeChat/jkbk/#/home',
			officialLink: 'https://ddys-wechat.diandianys.com/WeChat/jkbk/#/home',
			ddhyLink: 'https://ddys-wechat.diandianys.com/WeChat/jkbk/#/home'
		}, {
			name: '名医讲堂',
			testLink: 'http://test-ddys-wechat.hztywl.cn/WeChat/video/#/home',
			officialLink: 'https://ddys-wechat.diandianys.com/WeChat/video/#/home',
			ddhyLink: 'https://ddys-wechat.diandianys.com/WeChat/ddhy/video/#/home'
		}, {
			name: '健康商城',
			testLink: 'http://weixin.wowys.com/HTML/shop.html#/?hosid=33010090',
			officialLink: 'http://weixin.wowys.com/HTML/shop.html#/?hosid=33010090',
			ddhyLink: 'http://weixin.wowys.com/HTML/shop.html#/?hosid=33010090'
		}, {
			name: '我的预约',
			testLink: 'http://test-ddys-wechat.hztywl.cn/WeChat/ddys/#/myAppointment',
			officialLink: 'https://ddys-wechat.diandianys.com/WeChat/ddys/#/myAppointment',
			ddhyLink: 'https://ddys-wechat.diandianys.com/WeChat/ddhy/new-ddys/#/myAppointment'
		}]
		for (var i in locationArray) {
			// console.log(locationArray[i])
			// 先锁定那个项目
			if (options.name == locationArray[i].name) {
				var a = document.createElement('a')
				// 除测试以为全部跳正式地址
				if (config.wxid == 'wxe274576d295e0050') {
					a.href = locationArray[i].testLink
				} else if (config.wxid == 'wxe143c7c832718250') {
					a.href = locationArray[i].ddhyLink
				} else {
					a.href = locationArray[i].officialLink
				}
				console.log(a.origin)
				console.log(a.pathname)
				// 根据跳转类型跳转相应页面
				if (options.goToType == 'link') {
					// 添加登录状态跳转
					if (options.loginState == true && options.loginState && options.loginState != '') {
						if (util.getVal('userInfo')) {
							location.href = a.href + '?patientId=' + util.getVal('userInfo').patientId
						} else {
							location.href = a.href + '?patientId=1'
						}
						return false
					}
					location.href = a.href
				} else if (options.goToType == 'router' && options.hash != '') {
					location.href = a.origin + a.pathname + options.hash
				} else {
					util.hintIsModal('跳转请求设置错误', this)
				}
			}
		}
	}
}
export default new Vuex.Store({
	state,
	mutations
})
