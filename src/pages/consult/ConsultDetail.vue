<template lang="jade">
	#consultDetail
		div(v-if="info")
			.bg-white
				.flex.py3.border-bottom.mx2
					.flex-max {{info.docName}} {{info.userSex | sex}} {{info.userAge}}岁
					.gray {{info.createTime}}
			.p2.bottom_bg.bg-white
				div {{info.consultContent}}
				.flex.py2(v-if="info.consultImg || info.consultImg2 || info.consultImg3")
					.w33(style="height:90px", v-if="info.consultImg")
						img.block.w10.h10(:src="info.consultImg", @click="reading(info.consultImg)")
					.mx2.w33(style="height:90px", v-if="info.consultImg2")
						img.block.w10.h10(:src="info.consultImg2", @click="reading(info.consultImg2)")
					.w33(style="height:90px", v-if="info.consultImg3")
						img.block.w10.h10(:src="info.consultImg3", @click="reading(info.consultImg3)")
		.p2.flex.mt2.bg-white
			.red.mr2 {{info.price}}元
			.gray 团队咨询
		.explain.absolute.text-center
			.gray.w9.mx-auto(:class="{'f5':smallScree}") 先回复患者的医生对这条咨询负责，将获得该咨询的全部收入，团队成员的其他医生也可以帮助回答
		.btn.absolute.w10.bottom0(@click="jump") 我来回答
</template>
<script>
import { consultInfo } from '@/http/getData'
import { readImgs } from '@/configs/common'
export default{
	components: {},
	data ()	{
		return {
			smallScree: false,
			consultId: this.$route.params.consultId,
			info: ''
		}
	},
	mounted () {
		this.$store.state.isLoding = false
		if (window.screen.width <= 320) {
			this.smallScree = true
		}
		this.initData()
	},
	methods: {
		async initData () {
			const res = await consultInfo({'consultId': this.consultId})
			if (res.data.code === '0') {
				res.data.obj.createTime = this.$util.formatDate(new Date(res.data.obj.createTime), 2)
				this.info = res.data.obj
			}
		},
		jump () {
			this.$router.push(`/teamConsult/${this.info.consultId}`)
		},
		reading (cutter) {
			var arry = [this.info.consultImg, this.info.consultImg2, this.info.consultImg3].filter(item => !!item)
			readImgs(cutter, arry)
		}
	},
	watch: {
	},
	filters: {
		sex (val) {
			if (val == '1') {
				return '男'
			} else {
				return '女'
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
	#consultDetail
		background-color #f1f1f1
		height 100%
		position fixed
		width 100%
	.explain
		bottom 88px
	.btn
		padding 0
		height 45px
		line-height 45px
	.w10
		width 100%
	.h10
		height 100%
</style>
