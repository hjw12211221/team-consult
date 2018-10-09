<template lang="jade">
#register
	.content.bg-white.handle-border-bottom.flex
			span.phone 手&nbsp;&nbsp;机&nbsp;&nbsp;号：
			input.flex-max(v-model="myPhone", placeholder="请输入您的手机号", type="number")
		.flex.border-bottom.align-center.pl2.bg-white
			span 验&nbsp;&nbsp;证&nbsp;&nbsp;码：
			input.flex-max(v-model="myCode" placeholder="请输您的验证码")
			button.btn(@click="initCode" ,ref="btn", :disabled='flag') 获取验证码
	.content.bg-white.handle-border-bottom.flex
			span.phone 密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码：
			input.flex-max(v-model="pwd" placeholder="请输入您的密码" type="password")
	.button(@click="commmit" ,:class='{"bg-primary":isClick}') 完成
</template>
<script>
import bookApi from '../../configs/bookApi.js'
import MD5 from 'MD5'
let count = 5
let myTimeOut = ''
export default{
	components: {},
	data ()	{
		return {
			myCode: '',
			myPhone: '',
			pwd: '',
			flag: false,
			cid: '',
			userInfo: this.$util.getVal('userInfo')
		}
	},
	computed: {
		isClick () {
			return this.myCode && this.myPhone && this.pwd
		}
	},
	mounted () {
		this.$store.state.isLoding = false
	},
	methods: {
		getCode () {
			if (this.myPhone) {
				this.flag = true
				count--
				if (count == 0) {
					this.$refs.btn.innerHTML = '重新发送'
					clearTimeout(myTimeOut)
					this.$refs.btn.style.background = '#3d9bff'
					this.flag = false
					count = 5
				} else {
					this.$refs.btn.style.background = '#ccc'
					this.$refs.btn.innerHTML = count + 's后发送'
					myTimeOut = setTimeout(this.getCode, 1000)
				}
			} else {
				this.$setHint({'val': '手机号不能为空'})
			}
		},
		initCode () {
			this.getCode()
			bookApi('ddyy.book.captcha.generate', {
				bizType: '21',
				userMobile: this.myPhone
			}).then((res) => {
				if (res.data.code == 0) {
				} else {
					this.$setHint({'val': res.data.msg})
				}
			})
		},
		commmit () {
			if (!this.isClick) {
				return false
			} else {
				if (this.myCode.length > 0 && this.pwd.length > 5 && this.pwd.length < 21) {
					bookApi('ddys.book.patient.register.v2', {
						loginName: this.myPhone,
						captcha: this.myCode,
						password: MD5(this.pwd)
					}).then((res) => {
						if (res.data.code == 0) {
							// 成功后清除检测时所需信息 避免后续流程冲突
							localStorage.removeItem('patientCardNo')
							this.$router.push({path: '/loginHome'})
						} else {
							this.$setHint({'val': res.data.msg})
						}
					})
				} else if (this.myCode.length < 1) {
					this.$setHint({'val': '请先填写验证码'})
				} else if (this.pwd.length < 1) {
					this.$setHint({'val': '新密码不能为空'})
				} else if (this.pwd.length < 6 || this.pwd.length > 20) {
					this.$setHint({'val': '密码长度应为6-20位字符'})
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
#register
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
.mask-center
	width 90%
	margin 0 auto
	padding 20px
	border-radius 10px
	background #fff
	transform translate(0, 70%)
.phone
	line-height 40px
	padding-left 9px
</style>
