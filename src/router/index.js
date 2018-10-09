import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const createImportFactory = (path) => () => import(`@/pages/${path}`)
export default new Router({
	routes: [ // 妇儿首页
		{ path: '/', meta: { title: '团队咨询' }, component: createImportFactory('Home') },
		// 咨询管理
		{ path: '/consultList', meta: { title: '咨询管理' }, component: createImportFactory('consult/ConsultList') },
		// 咨询详情
		{ path: '/consultDetail/:consultId', meta: { title: '咨询详情' }, component: createImportFactory('consult/ConsultDetail') },
		// 团队咨询
		{ path: '/teamConsult/:consultId', meta: { title: '团队咨询' }, component: createImportFactory('consult/TeamConsult') },
		// 个人中心
		{ path: '/myHome', meta: { title: '我的' }, component: createImportFactory('my/MyHome') },
		// 我的二维码
		{ path: '/myCode', meta: { title: '我的二维码' }, component: createImportFactory('my/MyCode') },
		// 个人信息
		{ path: '/myInfo', meta: { title: '个人信息' }, component: createImportFactory('my/MyInfo') },
		// 我的团队
		{ path: '/myTeam/:teamId', meta: { title: '我的团队' }, component: createImportFactory('my/MyTeam') },
		// 团队列表
		{ path: '/teamList', meta: { title: '选择团队' }, component: createImportFactory('my/TeamList') },
		// 图文咨询
		{ path: '/imgConsult', meta: { title: '图文咨询' }, component: createImportFactory('my/ImgConsult') },
		// 我的提现
		{ path: '/myIncome', meta: { title: '我的收益' }, component: createImportFactory('my/MyIncome') },
		// 收益提现
		{ path: '/deposit', meta: { title: '收益提现' }, component: createImportFactory('my/Deposit') },
		// 提现手机验证码
		{ path: '/testPhone', meta: { title: '验证手机号' }, component: createImportFactory('my/TestPhone') },
		// 我的银行卡
		{ path: '/myBank', meta: { title: '我的银行卡' }, component: createImportFactory('my/MyBank') },
		// 添加银行卡号
		{ path: '/addBank', meta: { title: '添加银行卡号' }, component: createImportFactory('my/AddBank') },
		// 选择银行卡
		{ path: '/selecBank', meta: { title: '选择银行卡' }, component: createImportFactory('my/SelecBank') },
		// 设置
		{ path: '/setting', meta: { title: '设置' }, component: createImportFactory('my/Setting') },
		// 修改密码
		{ path: '/rePassword', meta: { title: '修改密码' }, component: createImportFactory('my/RePassword') },
		// 登入首页
		{ path: '/loginHome', meta: { title: ' 登入' }, component: createImportFactory('login/LoginHome') },
		// 忘记密码
		{ path: '/forgetPwd', meta: { title: '找回密码' }, component: createImportFactory('login/ForgetPwd') },
		// 注册
		{ path: '/register', meta: { title: ' 注册' }, component: createImportFactory('login/Register') },
		// 验证手机号
		{ path: '/checkPhone', meta: { title: '验证手机号' }, component: createImportFactory('login/CheckPhone.vue') },
		// 患者管理
		{ path: '/patient', meta: { title: '患者管理' }, component: createImportFactory('patients/Patient') },
		// 分组管理
		{ path: '/managementGroup', meta: { title: '分组管理' }, component: createImportFactory('patients/ManagementGroup') },
		// 搜索
		{ path: '/search', meta: { title: '搜索' }, component: createImportFactory('patients/Search') },
		// 新关注患者
		{ path: '/newPatient', meta: { title: '新关注患者' }, component: createImportFactory('patients/NewPatient') },
		// 选择群发患者
		{ path: '/selectPatient', meta: { title: '选择群发患者' }, component: createImportFactory('patients/SelectPatient') },
		// 群发消息详情
		{ path: '/msgDetail/:smsId', meta: { title: '群发消息' }, component: createImportFactory('patients/MsgDetail') },
		// 群发消记录
		{ path: '/msgList', meta: { title: '群发记录' }, component: createImportFactory('patients/MsgList') },
		// 患者资料
		{ path: '/patientInfo', meta: { title: '患者资料' }, component: createImportFactory('patients/PatientInfo') }
	]
})
