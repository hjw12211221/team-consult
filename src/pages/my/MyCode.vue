<template lang="jade">
	#myCode
		.containt(v-if='info')
			.myHeader
				.flex.pt3
					.circle.overflow
						img.block(:src="info.docAvatar || '../../images/defalu.png'")
					.flex-max.omit
						.f4 {{info.docName}}
						.my1.f5
							span.mr2 {{deptName}}
							span {{info.docTitle}}
						.f5 {{info.hosName}}
			.content
				.relative.box.mx-auto
					.code.absolute
						img.block.w10(:src="info.docQrcode")
					.b-top
					.b-bottom
					.b-left
					.b-right
			.text-center.f5 可以将我的二维码名片分享给好友和朋友圈
</template>
<script>
import { myCode } from '@/http/getData'
export default{
	components: {},
	data ()	{
		return {
			info: '',
			deptName: this.$util.getVal('docInfo').deptName
		}
	},
	mounted () {
		this.initData()
	},
	methods: {
		async initData () {
			const res = await myCode({'sysDocId': this.$util.getVal('docInfo').sysDocId})
			if (res.data.code === '0') {
				this.$store.state.isLoding = false
				this.info = res.data.obj
			} else {
				this.$setHint({'val': res.data.msg})
			}
		}
	},
	watch: {
	}
}
</script>
<style lang="stylus" scoped>
#myCode
	position absolute
	top 0
	bottom 0
	left 0
	right 0
	background #f1f1f1
.containt
	width 300px
	margin 0 auto
	padding-bottom 80px
	background #fff
	border-radius 10px
	margin-top 50px
.circle
	width 56px
	height 56px
	margin-right 11px
	margin-left 22px
	img
		width 100%
		height 100%
.content
	margin 35px 0 50px 0
.box
	position relative
	width 235px
	height 235px
	border 3px solid #3d9bff
.code
	width 220px
	top 50%
	left 50%
	transform translate(-50%,-50%)
.b-top
	position absolute
	top -3px
	left 50%
	width 80%
	height 3px
	background-color #fff
	transform translate(-50%,0)
	z-index 100
.b-bottom
	position absolute
	bottom -3px
	left 50%
	width 80%
	height 3px
	background-color #fff
	transform translate(-50%,0)
	z-index 100
.b-left
	position absolute
	top 0
	left -3px
	height 80%
	width 3px
	background-color #fff
	transform translate(0,12%)
	z-index 100
.b-right
	position absolute
	top 0
	right -3px
	height 80%
	width 3px
	background-color #fff
	transform translate(0,12%)
	z-index 100
</style>
