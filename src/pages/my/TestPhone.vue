<template lang="jade">
#testPhone
	.fixed.right0.left0.top0
		.primary.f5.mx2 为保证本人提现资金安全，需要手机号
	.content.bg-white.handle-border-bottom.flex
			span.phone 手机号：
			input.flex-max(v-model="myPhone" placeholder="请输入您的手机号")
		.flex.border-bottom.align-center.pl2.bg-white
			span 验证码：
			input.flex-max(v-model="myCode" placeholder="请输您的验证码")
			button.btn(@click="getCode" ,ref="btn", :disabled='flag') 获取验证码
	.button(@click="commmit" ,:class='{"bg-primary":isClick}') 提交
	.mask(v-if="mask")
		.mask-center
			.text-center 提交成功
			.c9.py4 您的收益提现已提交，平台会在3-5个工作日给指定的银行卡账号汇款，请注意查收。
			button.w10(@click="back") 我知道了
</template>
<script>
import { phoneCode, deposit } from '@/http/getData'
let count = 60
let myTimeOut = ''
export default{
	components: {},
	data ()	{
		return {
			myCode: '',
			myPhone: '',
			flag: false,
			mask: false,
			bankInfo: this.$util.getCache('depositObj')
		}
	},
	computed: {
		isClick () {
			return this.myCode && this.myPhone
		}
	},
	mounted () {
		this.$store.state.isLoding = false
	},
	methods: {
		initCode () {
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
				myTimeOut = setTimeout(this.initCode, 1000)
			}
		},
		async getCode () {
			if (this.myPhone) {
				this.$store.state.isLoding = false
				const res = await phoneCode({'bizType': '11', docMobile: this.myPhone})
				if (res.data.code == 0) {
					this.initCode()
				} else {
					this.$setHint({'val': res.data.msg})
				}
			} else {
				this.$setHint({'val': '手机号不能为空'})
				return false
			}
		},
		async commmit () {
			if (!this.isClick) {
				return false
			} else {
				const res = await deposit({
					'docId': this.$util.getVal('docInfo').sysDocId,
					'amount': this.bankInfo.amount,
					'extractWay': '3',
					'bankName': this.bankInfo.bankName, // 银行名称
					'bankCardNo': this.bankInfo.bankCardNo, // 银行卡号
					'bankBranch': this.bankInfo.bankBranch, // 银行支行名称
					'captcha': this.myCode
				})
				if (res.data.code === '0') {
					this.mask = true
				} else {
					this.$setHint({'val': res.data.msg})
				}
			}
		},
		back () {
			this.$router.push('/myIncome')
		}
	},
	watch: {
	}
}
</script>
<style lang="stylus" scoped>
#testPhone
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
.content
	margin-top 35px
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
	font-size 14px
	width 100px
	height 40px
	line-height 40px
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