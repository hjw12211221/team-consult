import App from './App'
import Vue from 'vue'
import router from './router'
// import ddysInit from './configs/ddys_init.js' //   授权
import scrollLoad from './directives/scrollLoad.js' //  全局指令
import install from './plugins/install' //  全局方法  $api=>bookAPi  $util=>util
import components from './plugins/components' //  全局模块
import FastClick from 'fastclick'
import store from './store/store'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
// import './configs/ddys_init.js'
Vue.config.productionTip = false

Vue.use(MintUI)
Vue.use(install)
Vue.use(components)

// 添加 Fastclick 移除移动端点击延迟
FastClick.attach(document.body)

// 添加标题

router.beforeEach((to, from, next) => {
	if (to.meta.title) {
		Vue.prototype.$util.setTitle(to.meta.title)
	}
	next()
})
/* eslint-disable no-new */
const app = new Vue({
	el: '#app',
	router,
	store,
	components: { App },
	template: '<App/>'
})

Object.getPrototypeOf(app).$setHint = function (obj) {
	this.$store.commit('setHint', obj)
}
