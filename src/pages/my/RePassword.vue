<template lang="jade">
#rePassword
	.flex.px3.py2.border-bottom.bg-white.align-center
		.f4 旧密码：
		input(placeholder="请输入您的密码", v-model="oldPwd", type="password")
	.flex.px3.py2.border-bottom.bg-white.align-center
		.f4 新密码：
		input(placeholder="请输入6-20字符", v-model="newPwd", type="password")
	.flex.px3.py2.border-bottom.bg-white.align-center
		.f4 确认密码：
		input(placeholder="请再次确认您的密码", v-model="comfirPwd", type="password")
	.text-center.top
		.btn(@click="succss") 完成
</template>
<script>
import { upPwd } from '@/http/getData'
import md5 from 'md5'
export default{
	components: {},
	data ()	{
		return {
			oldPwd: '',
			newPwd: '',
			comfirPwd: ''
		}
	},
	mounted () {
		this.$store.state.isLoding = false
	},
	methods: {
		async succss () {
			if (this.oldPwd == '') {
				this.$setHint({'val': '请输入旧密码'})
			} else if (this.oldPwd == this.newPwd) {
				this.$setHint({'val': '新密码不能与旧密码相同'})
			} else if (this.newPwd == '') {
				this.$setHint({'val': '请输入新密码'})
			} else if (this.newPwd.length < 6) {
				this.$setHint({'val': '密码不能小于6位'})
			} else if (this.comfirPwd == '') {
				this.$setHint({'val': '请输入确认密码'})
			} else if (this.comfirPwd != this.newPwd) {
				this.$setHint({'val': '两次密码设置不同'})
			} else {
				const res = await upPwd({
					'sysDocId': this.$util.getVal('docInfo').sysDocId,
					'password': md5(this.oldPwd),
					'newPassword': md5(this.newPwd)
				})
				if (res.data.code === '0') {
					this.$setHint({'val': '修改成功'})
					this.$util.remove('docInfo')
					this.$router.push('/loginHome')
				} else {
					this.$setHint({'val': res.data.msg})
				}
			}
		}
	},
	watch: {
	}
}
</script>
<style lang="stylus" scoped>
#rePassword
	position absolute
	top 0
	bottom 0
	left 0
	right 0
	background #f1f1f1
.top
	margin-top 60px
.btn
	height 45px
	line-height 45px
	padding 0
	width 90%
input
	// line-height 30px
	font-size 14px
</style>