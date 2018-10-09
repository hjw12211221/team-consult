//  导入所有要注册的全局模块
var comoments = require.context('../components', true, /\.vue$/)
export default (Vue) => comoments.keys().map(key => { //  key为 模块名 比如：'./addId.vue'
	console.log(key)
	const comName = key.replace(/^\.\//, '').replace(/\.\w+$/, '') //  正则替换模块名
	Vue.component(comName, comoments(key).default) //  注册模块
})
