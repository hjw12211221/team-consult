<template lang="jade">
#loginHome(v-if="!addLogin")
	.has-header.w10
		center.py3.mt3
		input.block.f4.w8.mx-auto.my2.bg.round(
			style="height:30px;text-indent: 15px;"
			placeholder = "请输入手机号"
			v-model="loginName"
		)
		.password
			input.block.f4.w8.mx-auto.my4.bg.round(
				style="height:30px;text-indent: 15px;"
				placeholder = "请输入密码"
				:type="passwordType"
				v-model="password"
			)
			.passwordShow(@click="passwordType='text'" v-if="passwordType=='password'")
			.passwordHide(@click="passwordType='password'" v-if="passwordType=='text'")
		button.block.btn-block(
			style="margin-top:30px;width:80%;margin:25px auto 15px;"
			@click="login"
		) 登录
		.py2.w8.mx-auto.clear
			.float-r.primary.f5(
				@click="jumpToVerify('a')"
			) 忘记密码?
</template>
<script>
import md5 from 'md5'
import bookApi from '../../configs/bookApi.js'
export default {
	components: {
	},
	data () {
		return {
			count: 60,
			flag: false,
			getCodeText: '发送验证码',
			patientMobile: '',
			code: '',
			loginName: '',
			password: '',
			passwordType: 'password',
			loginType: '1',
			bookPatient: '',
			addLogin: false, // 无loginName弹出层开关
			isPaint: this.$util.getQstr('isPaint')
		}
	},
	mounted () {
		this.checkState()
		this.$store.state.isLoding = false
		if (this.$util.getVal('weChat') && this.$util.getVal('weChat') != null) {
		} else {
			this.$util.initData()
		}
	},
	methods: {
		checkState: function () {
			this.$util.setTitle('登录')
			// 检测从哪里跳转过来的 默认我的主页不检测
			// 是否来源与注册页
			if (this.$util.getVal('register') && this.$util.getVal('register').length > 5) {
				var bookPatient = this.$util.getVal('bookPatient')
				// 赋值帐号信息自动登录
				this.loginName = bookPatient.loginName
				this.password = this.$util.getVal('register')
				this.loginType = '1'
				this.$util.removeVal('register')
				setTimeout(this.login, 1000)
			}
			// 是否来源与修改密码页
		},
		login () {
			if (this.loginName.length == 0) {
				this.$setHint({'val': '手机号不能为空'})
				return false
			} else if (this.loginType === '1' && this.loginName.length != 11) {
				this.$setHint({'val': '手机号无效'})
				return false
			}
			if (this.loginName.length == 11 && this.password.length > 5 && this.password.length < 21) {
				this.$store.state.isLoding = true
				bookApi('ddyy.sys.doc.login', {
					docMobile: this.loginName,
					loginType: this.loginType,
					password: this.password
				}).then((res) => {
					if (res.data.code == 0) {
						this.goto(res.data.obj)
					} else {
						this.$setHint({'val': res.data.msg})
					}
					this.$store.state.isLoding = false
				})
			} else if (this.password.length == 0) {
				this.$setHint({'val': '密码不能为空'})
			} else if (this.password.length < 6 || this.password.length > 20) {
				this.$setHint({'val': '密码长度为6-20位字符'})
			} else {
				this.$setHint({'val': '未知错误'})
			}
		},
		goto (data) {
			// alert(this.$util.getVal('weChat').openid)
			this.$util.setVal('docInfo', data)
			// this.$util.setValLogin(data)
			// 如果来自于其它项目 跳转到绝对地址
			if (this.$util.getVal('redirect') && this.$util.getVal('redirect') != null) {
				this.$router.push(`${this.$util.getVal('redirect')}`)
				// var URL = decodeURIComponent(this.$util.getVal('source'))
				// // ?号在#号后面
				// if (URL.indexOf('?') > 0 && URL.indexOf('?') > URL.indexOf('#')) {
				// 	location.href = this.$util.getVal('source') + '&sysDocId=' + data.sysDocId
				// } else {
				// 	// var url = this.$util.getVal('source') + '?sysDocId=' + data.sysDocId
				// 	// window.location.href = url
				// 	this.$router.push(`${this.$util.getVal('redirect')}`)
				// }
				// this.$util.removeVal('source')
			} else {
				// alert('web系统错误')
			}
			// 推送
			if (this.$util.getVal('weChat').openid) {
				bookApi('ddyy.doc.pushid.modify', {
					'sysDocId': this.$util.getVal('docInfo').sysDocId,
					'openid': this.$util.getVal('weChat').openid || ''
				}).then((res) => {
					if (res.data.code == 0) {
						// alert('成功')
					}
				})
			} else {
				this.$util.initData()
			}
		},
		// 切换登录状态
		toogleLoginType (val) {
			if (val === this.loginType) {
				return false
			} else {
				this.loginType = val
				this.loginName = ''
				this.password = ''
				this.passwordType = 'password'
			}
		},
		// 跳转到证件验证页面
		jumpToVerify (type) {
			if (type == 'a') {
				this.$util.setVal('type', 'a')
				this.$router.push({path: '/forgetPwd'})
			} else if (type == 'b') {
				this.$util.setVal('type', 'b')
				this.$router.push({path: '/register'})
			}
		},
		addName () {
			bookApi('ddyy.book.patient.bind.mobile.user', {
				patientId: this.bookPatient.patientId,
				patientMobile: this.patientMobile,
				captcha: this.code
			}).then((res) => {
				if (res.data.code == 0) {
					console.log('成功', res.data)
					// 成功后存储用户信息并跳到登录页自动完成登录
					var userInfo = this.bookPatient
					userInfo.loginName = this.patientMobile
					this.goto(userInfo)
				} else {
					this.$setHint({'val': res.data.msg})
				}
			})
		},
		// 获取验证码
		getCode () {
			this.flag = true
			if (this.patientMobile.length > 0 && (this.getCodeText == '发送验证码' || this.getCodeText == '重新获取')) {
				this.count = 60
				bookApi('ddyy.book.captcha.generate', {
					patientId: this.bookPatient.patientId,
					bizType: '22',
					userMobile: this.patientMobile
				}).then((res) => {
					if (res.data.code == 0) {
						// 获取验证码按钮倒计时
						window.timer = setInterval(this.codeTextFn, 1000)
						// 一分钟后text为重新获取
						setTimeout(function () {
							clearInterval(timer)
							this.getCodeText = '重新获取'
						}.bind(this), 60000)
					} else {
						this.$setHint({'val': res.data.msg})
						this.getCodeText = '重新获取'
					}
					setTimeout(() => {
						this.flag = false
					}, 2000)
				})
			} else {
				this.flag = false
				this.$setHint({'val': '请先输入手机号'})
			}
		},
		check: function () {
			// 检测证件号api
			if (this.patientMobile.length > 0) {
				if (this.patientMobile.length == 11) {
					// 检测手机号
					bookApi('ddys.book.patient.mobile.check', {
						loginName: this.patientMobile
					}).then((res) => {
						if (res.data.code == 0) {
							this.getCode()
						} else {
							this.$setHint({'val': res.data.msg})
						}
					})
				} else {
					this.$setHint({'val': '手机号格式错误'})
				}
			} else {
				this.$setHint({'val': '请输入手机号'})
			}
		},
		// 改变获取验证码按钮text
		codeTextFn: function () {
			if (this.count >= 0) {
				this.count = this.count - 1
				this.getCodeText = this.count + '秒重新获取'
			} else {
				this.getCodeText = '重新获取'
			}
		}
	}
}
</script>
<style lang="stylus">

</style>
