<template lang="jade">
#forgetPwd
	.content.bg-white.handle-border-bottom.flex.align-center
			span.phone 手&nbsp;&nbsp;机&nbsp;&nbsp;号：
			input.flex-max(v-model="myPhone", placeholder="请输入您的手机号", type="number")
		.flex.border-bottom.align-center.pl2.bg-white
			span.code 验&nbsp;&nbsp;证&nbsp;&nbsp;码：
			input.flex-max(v-model="myCode" placeholder="请输您的验证码")
			button.btn(@click="initCode" ,ref="btn", :disabled='flag') 获取验证码
	.content.bg-white.handle-border-bottom.flex.align-center
			span.phone 密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码：
			input.flex-max(v-model="pwd" placeholder="请输入您的密码" type="password")
		.flex.border-bottom.align-center.bg-white
			span.phone 确认密码：
			input.flex-max(v-model="againpwd" placeholder="请再次确认您的密码" type="password")
	.button(@click="commmit" ,:class='{"bg-primary":isClick}') 完成
</template>
<script>
import bookApi from '../../configs/bookApi.js'
import md5 from 'md5'
let count = 60
let myTimeOut = ''
export default{
	components: {},
	data ()	{
		return {
			myCode: '',
			myPhone: '',
			pwd: '',
			againpwd: '',
			flag: false,
			cid: '',
			docInfo: this.$util.getVal('docInfo')
		}
	},
	computed: {
		isClick () {
			return this.myPhone && this.pwd && this.againpwd
		}
	},
	mounted () {
		this.$store.state.isLoding = false
	},
	methods: {
		getCode () {
			this.flag = true
			count--
			if (count == 0) {
				this.$refs.btn.innerHTML = '重新发送'
				clearTimeout(myTimeOut)
				this.$refs.btn.style.background = '#3d9bff'
				this.flag = false
				count = 60
			} else {
				this.$refs.btn.style.background = '#ccc'
				this.$refs.btn.innerHTML = count + 's后发送'
				myTimeOut = setTimeout(this.getCode, 1000)
			}
		},
		initCode () {
			if (this.myPhone == '') {
				this.$setHint({'val': '该手机号不能为空'})
			} else if (!(/^1[34578]\d{9}$/.test(this.myPhone))) {
				this.$setHint({'val': '该手机号格式不正确'})
			} else {
				bookApi('ddyy.book.captcha.generate', {
					bizType: '10',
					docMobile: this.myPhone
				}).then((res) => {
					if (res.data.code == 0) {
						this.getCode()
						this.cid = res.data.obj.cid
					} else {
						this.$setHint({'val': res.data.msg})
					}
				})
			}
		},
		commmit () {
			if (!this.isClick) {
				return false
			} else {
				if (this.myCode.length > 0 && this.pwd.length > 5 && this.pwd.length < 21 && this.pwd == this.againpwd) {
					bookApi('ddyy.sys.doc.password.reset', {
						docMobile: this.myPhone,
						captcha: this.myCode,
						password: md5(this.pwd)
					}).then((res) => {
						if (res.data.code == 0) {
							// 成功后清除检测时所需信息 避免后续流程冲突
							// localStorage.removeItem('patientCardNo')
							this.$util.remove('docInfo')
							this.$router.push({path: '/loginHome'})
						} else {
							this.$setHint({'val': res.data.msg})
						}
					})
				} else if (this.myCode.length < 1) {
					this.$setHint({'val': '请先填写验证码'})
				} else if (this.pwd.length < 1) {
					this.$setHint({'val': '新密码不能为空'})
				} else if (this.againpwd.length < 1) {
					this.$setHint({'val': '确认密码不能为空'})
				} else if (this.pwd.length < 6 || this.pwd.length > 20) {
					this.$setHint({'val': '密码长度应为6-20位字符'})
				} else if (this.pwd != this.againpwd) {
					this.$setHint({'val': '两次密码输入不一致'})
				} else {
					this.$setHint({'val': '未知错误'})
				}
			}
		}
	},
	watch: {
	}
}
</script>
<style lang="stylus" scoped>
#forgetPwd
	position absolute
	top 0
	bottom 0
	left 0
	right 0
	background #f1f1f1
.fixed
	height 35px
	line-height 35px
	background rgb(208,227,247)
.btn
	width 125px
	height 45px
	line-height 45px
	padding 0
	border-radius  0
.button
	width 90%
	height 40px
	line-height 40px
	background #cacaca
	margin 50px auto 0
	text-align center
	color #fff
	border-radius 10px
input
	width 100px
	height 40px
	font-size 14px
.mask-center
	width 90%
	margin 0 auto
	padding 20px
	border-radius 10px
	background #fff
	transform translate(0, 70%)
.phone
	// height 40px
	// line-height 40px
	padding-left 9px
.code
	// lint-height 40px
</style>
