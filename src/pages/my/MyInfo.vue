<template lang="jade">
#myInfo
	.flex.py2.px3.align-center.bottom_bg.bg-white(v-if='info', @click="myChange")
		.flex-max 医生照片
		.circle.overflow
			img.block.h10(:src="docImg")
		icon-svg.c9.ml2(iconClass='arrow-right')
	.content(v-if='info',style="margin-bottom:45px")
		.flex.p3.align-centen.mt2.border-bottom.bg-white
			.flex-max	医生姓名
			.c9	{{info.docName}}
		.flex.p3.align-centen.border-bottom.bg-white
			.flex-max	所属医院
			.c9	{{info.hosName}}
		.flex.p3.align-centen.border-bottom.bg-white
			.flex-max	专业科室
			.c9	{{info.deptName}}
		.flex.p3.align-centen.border-bottom.bg-white
			.flex-max	医生职称
			.c9	{{info.docTitle}}
		.border-bottom.px3.bg-white
			.py3 医生擅长
			textarea(placeholder= "请输入医生擅长信息..." style='resize:none;' v-model="goodAt")
		.border-bottom.px3.bg-white
			.py3 医生介绍
			textarea(placeholder= "请输入医生介绍信息..." style='resize:none;' v-model="introduce")
	.fixed.bottom0.left0.right0
		.btn.w10(@click="save") 保存
	//- .fixed.input1.left0.right0
	//- 		input(type="file", accept="image/*", @change="myChange")
</template>
<script>
import { myHome, myInfo, addImg } from '@/http/getData'
import { WecharImg } from '@/configs/common'
export default{
	components: {},
	data ()	{
		return {
			info: '',
			docCode: '',
			goodAt: '',
			introduce: '',
			requestResult: '',
			docImg: '',
			defaultImg: require('../../images/defalu.png')
		}
	},
	mounted () {
		this.initData()
	},
	methods: {
		myChange () {
			// this.$store.state.isLoding = true
			// var input = document.querySelector('input')
			// getImgBase(e, addImg, this.success, this)
			WecharImg(this.success, this)
		},
		async initData () {
			const res = await myHome({'sysDocId': this.$util.getVal('docInfo').sysDocId})
			if (res.data.code === '0') {
				this.$store.state.isLoding = false
				this.info = res.data.obj
				this.docCode = res.data.obj.deptCode
				this.introduce = res.data.obj.docDescription
				this.goodAt = res.data.obj.docGoodat
				this.docImg = this.info.docAvatar || this.defaultImg
			} else {
				this.$store.state.isLoding = false
				this.$setHint({'val': res.data.msg})
			}
		},
		success (imgSrc) {
			this.docImg = imgSrc
			this.$store.state.isLoding = false
		},
		async save () {
			if (this.goodAt.length < 20 || this.introduce.length < 20) {
				this.$setHint({'val': '医生介绍或擅长至少20个字'})
			} else {
				this.$store.state.isLoding = true
				const res = await myInfo({
					'sysDocId': this.$util.getVal('docInfo').sysDocId,
					'docName': this.info.docName,
					'hosName': this.info.hosName,
					'deptCode': this.docCode,
					'docTitle': this.info.docTitle,
					'docGoodat': this.goodAt,
					'docDescription': this.introduce,
					'docAvatar': this.docImg || this.info.defaultImg
				})
				if (res.data.code === '0') {
					this.$store.state.isLoding = false
					this.initData()
					this.$setHint({'val': '保存成功', hideCallback: () => { this.$router.push('/myHome') }})
				} else {
					this.$store.state.isLoding = false
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
#myHome
	position absolute
	top 0
	bottom 0
	left 0
	right 0
	background #f1f1f1
.btn
	padding 0
	height 45px
	line-height 45px
	border-radius 0
textarea
	width 100%
	height 100px
	outline none
	font-size 14px
	line-height 1.5
	color #999
	&::-webkit-input-placeholder
		font-size 15px
.input1
	z-index 10001
	top 0px
	opacity 0
input
	width 100%
	height 76px
.circle
	height 56px
	width 56px
	img
		width 100%
.h10
	height 100%
</style>