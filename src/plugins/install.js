import util from './../configs/util'
import bookApi from './../configs/bookApi'
export default {
	install (Vue) {
		Vue.prototype.$util = util
		Vue.prototype.$api = bookApi
	}
}
