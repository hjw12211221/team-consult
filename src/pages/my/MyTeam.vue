<template lang="jade">
#myTeam
	.banner
		img.block(:src="info.teamAvatar")
	.flex.p3.align-center.border-bottom
		.flex-max {{info.teamName}}
		.c9
			img.mr1(src="../../images/fen.png",style="width:15px")
			span.f5 粉丝数 {{info.teamFansCount}}
	.p3.bottom_bg.dark
		.title.mb2 专家团队介绍
		.relative
			.f4(ref="word") {{instruce}}
			.f5.primary.absolute.bottom1.right0(@click= "word(1)", v-if= "showWord")
				icon-svg.c9.ml2.f2(iconClass='jiantou-copy-copy')
			.f5.primary.text-right(@click= "word(2)", v-if= "!showWord")
				icon-svg.c9.ml2.f2(iconClass='xiangshang')
	.p3.mt2.dark
		.title.mb2 专家团队成员
	.flex.wrap
		.w25.text-center.mb4(v-for="(x,index) in menberList")
			.relative.mx-auto.circle(style="width:56px")
				img.circle.block.h10.w10(:src="x.docAvatar || require('../../images/defalu.png')")
				img.absolute.top(src="../../images/top.png", v-if="x.advDocId == info.teamLeaderId",style="width:20px;height:20px")
			.name.omit {{x.docName}}
			.c9.f5.omit {{x.deptName}}
			.c9.f5.omit {{x.docTitle}}
</template>
<script>
import { teamHome } from '@/http/getData'
export default{
	components: {},
	data ()	{
		return {
			showWord: true,
			instruce: '',
			instruces: '',
			menberList: [],
			info: ''
		}
	},
	mounted () {
		this.$store.state.isLoding = false
		this.initData()
	},
	methods: {
		async initData () {
			const res = await teamHome({'teamId': this.$route.params.teamId})
			if (res.data.code === '0') {
				this.info = res.data.obj
				this.instruce = res.data.obj.teamResume
				this.instruces = res.data.obj.teamResume
				if (this.instruce.length > 50) {
					this.instruce = this.instruce.substr(0, 50) + '...'
				}
				res.data.advDocVoList.forEach((val, index) => {
					if (val.advDocId == this.info.teamLeaderId) {
						var arr = res.data.advDocVoList.slice(index, index + 1)[0]
						res.data.advDocVoList.splice(index, 1)
						res.data.advDocVoList.unshift(arr)
					}
				})
				this.menberList = res.data.advDocVoList
				// console.log(this.menberList)
			}
		},
		word (val) {
			if (val == 1) {
				this.showWord = false
				this.$refs.word.innerHTML = this.instruces
				// this.instruce = this.instruces
			} else {
				this.showWord = true
				this.$refs.word.innerHTML = this.instruce
				// this.instruce = this.instruce
			}
		}
	},
	watch: {
	}
}
</script>
<style lang="stylus" scoped>
.banner
	height 150px
  img
		width 100%
		height 100%
.c9
  img
    width 15px
.title
	position relative
.title:before
	content ''
	position absolute
	left -15px
	top 3px
	width 2px
	height 15px
	background #3d9bff
.circle
	width 56px
	height 56px
.name
	margin 10px 0 7px 0
.top
	width 20px
	top -7px
	right -8px
.bottom1
	bottom -1px
.h10
	height 100%
</style>