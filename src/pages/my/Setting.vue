<template lang="jade">
#setting
	router-link.flex.p3.border-bottom.bg-white(to="/rePassword")
		.flex-max 修改密码
		icon-svg.c9(iconClass='arrow-right')
	.text-center.top
		.btn(@click="exit") 退出当前账号
</template>
<script>
export default{
	components: {},
	data ()	{
		return {
			bankType: ''
		}
	},
	mounted () {
		this.$store.state.isLoding = false
	},
	methods: {
		save () {
			this.$router.push('/myBank')
		},
		exit () {
			this.$util.remove('docInfo')
			this.$util.runToLogin(this, this.jump())
		},
		jump () {
			this.$router.push('/myHome')
		}
	},
	watch: {
	}
}
</script>
<style lang="stylus" scoped>
#setting
	position absolute
	top 0
	bottom 0
	left 0
	right 0
	background #f1f1f1
.btn
	width 90%
	background #fff
	color #333
	padding 0
	height 40px
	line-height 40px
.top
	margin-top 100px
</style>