<template lang="jade">
#checkPhone
	.content.bg-white.handle-border-bottom.flex
			span.phone 手机号：
			input.flex-max(v-model="myPhone", placeholder="请输入您的手机号", type="number")
	.button(@click="commmit" ,:class='{"bg-primary":isClick}') 下一步
</template>
<script>
import bookApi from '../../configs/bookApi.js'
export default{
	components: {},
	data ()	{
		return {
			myPhone: ''
		}
	},
	computed: {
		isClick () {
			return this.myPhone
		}
	},
	mounted () {
		this.$store.state.isLoding = false
	},
	methods: {
		commmit () {
			if (!this.isClick) {
				return false
			} else if (!(/^1[34578]\d{9}$/.test(this.myPhone))) {
				this.$setHint({'val': '请输入正确手机号'})
			} else {
				bookApi('ddys.apiBookPatientServiceV2.patient.mobile.check', {'loginName': this.myPhone}).then((res) => {
					if (res.data.code == '-1' && res.data.msg == '该手机号已注册') {
						this.$router.push('/forgetPwd/' + this.myPhone)
					} else if (res.data.code == '0') {
						this.$setHint({'val': '该手机号未注册'})
					} else {
						this.$setHint({'val': res.data.msg})
					}
				})
			}
		}
	},
	watch: {
	}
}
</script>
<style lang="stylus" scoped>
#checkPhone
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
