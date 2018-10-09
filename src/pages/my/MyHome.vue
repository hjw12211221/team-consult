<template lang="jade">
	#myHome
		.myHeader.handle-border-bottom(style="height:150px", v-if='info')
			.flex.pt3
				.circle.overflow
					img.block.w10.h10(:src="docAvatar || '../../images/defalu.png'")
				.flex-max.white.omit
					div {{info.docName}}
					.my1.f5
						span.mr2 {{info.deptName}}
						span {{info.docTitle}}
					.f5 {{info.hosName}}
		.bottom_bg
			.flex.align-center.p2.handle-border-bottom.bg-white(v-for="(x,index) in infoList",:key="index",@click="jump(x,index)")
				.flex-max
					.flex.align-center
						.icont
							img(:src="x.img",style="width:20px")
						.f4 {{x.title}}
				icon-svg.c9(iconClass='arrow-right')
		.bottom_bg.mt2
			.flex.align-center.p2.handle-border-bottom.bg-white(v-for="(x,index) in list",:key="index",@click="jumpTo(x)")
				.flex-max
					.flex.align-center
						.icont
							img.block(:src="x.img",style="width:20px")
						.f4 {{x.title}}
				icon-svg.c9(iconClass='arrow-right')
		.flex.align-center.p2.handle-border-bottom.mt2.bg-white(@click="jumpTo(setting[0])")
				.flex-max
					.flex.align-center
						.icont
							img(:src="setting[0].img",style="width:20px")
						.f4 {{setting[0].title}}
				icon-svg.c9(iconClass='arrow-right')
		.absolute.bottom30.text-center.w10
			a.c9(href="tel:4006609100") 客服电话：4006609100
</template>
<script>
import { myHome, teamList } from '@/http/getData'
export default{
	components: {},
	data ()	{
		return {
			info: this.$util.getVal('docInfo'),
			infoList: [
				{'img': require('../../images/qr.png'), 'title': '二维码名片', 'router': '/myCode'},
				{'img': require('../../images/teampeople.png'), 'title': '我的团队', 'router': '/teamList'},
				{'img': require('../../images/personal.png'), 'title': '个人信息', 'router': '/myInfo'}
			],
			list: [
				{'img': require('../../images/photo.png'), 'title': '开通图文咨询', 'router': '/imgConsult'},
				{'img': require('../../images/income.png'), 'title': '我的收益', 'router': '/myIncome'},
				{'img': require('../../images/card.png'), 'title': '我的银行卡', 'router': '/myBank'}
			],
			setting: [
				{'img': require('../../images/set.png'), 'title': '设置', 'router': '/setting'}
			],
			docAvatar: ''
		}
	},
	mounted () {
		// alert(this.$util.getVal('docInfo'))
		this.$store.state.isLoding = false
		if (!this.$util.getVal('docInfo')) {
			// alert(this.$util.getVal('docInfo'))
			this.$util.runToLogin('/myHome', this)
			return false
		}
		if (this.$util.getVal('weChat') && this.$util.getVal('weChat') != null) {
		} else {
			this.$util.initData()
		}
		this.initData()
	},
	methods: {
		async initData () {
			const res = await myHome({'sysDocId': this.$util.getVal('docInfo').sysDocId})
			if (res.data.code === '0') {
				this.docAvatar = res.data.obj.docAvatar
				this.$util.setVal('docConsutlInfo', {sysDocId: this.info.sysDocId, isPay: res.data.advDocVo.isPay, payPrice: res.data.advDocVo.payPrice || ''})
			} else {
				this.$setHint({'val': res.data.msg})
			}
		},
		async jump (val, index) {
			// 判断我的团队是否为多个
			if (index == 1) {
				const res = await teamList({'advDocId': this.$util.getVal('docInfo').sysDocId})
				if (res.data.code === '0') {
					if (res.data.obj.length > 1) {
						this.$router.push('/teamList')
					} else if (res.data.obj.length == 1) {
						this.$router.push(`/myTeam/${res.data.obj[0].teamId}`)
					} else {
						this.$setHint({'val': '您还没有加入医生团队'})
					}
				} else {
					this.$setHint({'val': res.data.msg})
				}
			} else {
				this.$router.push(`${val.router}`)
			}
		},
		jumpTo (val) {
			this.$router.push(`${val.router}`)
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
.myHeader
	background-image url('../../images/bg-people.png')
	background-size cover
	background-position center
.circle
	width 56px
	height 56px
	margin-right 11px
	margin-left 22px
.headerImg
	width 50px
	height 50px
	border-radius 50%
.icont
	margin-left 10px
	margin-right 13px
	img
		vertical-align middle
		width 100%;
		height: 100%;
.bottom30
	bottom 30px
.h10
	height 100%
</style>
