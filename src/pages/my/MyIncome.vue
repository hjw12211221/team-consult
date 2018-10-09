<template lang="jade">
#myIncome
	.banner.flex.align-center.px4.bottom_bg
		.flex-max.white.pl3
			.num {{allIncome}}
			.f4.mt1 总收益（元）
		.pic
			img.block(src="../../images/tixian.png",@click="mask=true")
	.mt2.p2.c9.border-bottom 收益明细
	.flex.p3.border-bottom(v-for="x in list")
		.flex-max
			span.red(v-if="x.amount > 0") +
			span.red(v-if="x.amount < 0") -
			span.red.w2.inline-block {{x.amount}}
			span.c9.ml4.inline-block {{x.incomeSource}}
		.c9 {{x.createTime}}
	.mask(v-if="mask", @click="mask=!mask")
		.mask-center(@click.stop='')
			.text-center 提现说明
			.dark.row0.f5 收益最低提现100元。
			.dark.row1.f5 提现后将于每月25日统一汇款，如遇节假日则顺延至下一个工作日，汇款成功后短信通知。
			.dark.f5 上月21日（含21日）至当月20日发起的提现，将于当月25日统一汇款；当月21日（含21日）至次月20日发起的提现，将于次月25号统一汇款每月20号以后提现（含20号），将于下月20-25号统一汇款。
			.text-center
				button(@click="jump",:disabled="noClick",:class="{'bg':noClick}") 去提现
</template>
<script>
import { myIncome } from '@/http/getData'
export default{
	components: {},
	data ()	{
		return {
			mask: false,
			list: [],
			allIncome: '',
			noClick: false
		}
	},
	mounted () {
		this.$store.state.isLoding = false
		this.initData()
	},
	methods: {
		async initData () {
			const res = await myIncome({'docId': this.$util.getVal('docInfo').sysDocId})
			if (res.data.code === '0') {
				res.data.list.forEach((res) => {
					if (res.incomeSource == 1) {
						res.incomeSource = '悬赏'
					} else if (res.incomeSource == 2) {
						res.incomeSource = '付费咨询'
					} else if (res.incomeSource == 3) {
						res.incomeSource = '文章'
					} else if (res.incomeSource == 4) {
						res.incomeSource = '医生提现'
					} else if (res.incomeSource == 5) {
						res.incomeSource = '医生收益扣除'
					} else if (res.incomeSource == 'IN5') {
						res.incomeSource = '团队咨询'
					}
					res.createTime = this.$util.formatDate(new Date(res.createTime), 4)
				})
				this.list = res.data.list
				this.allIncome = res.data.obj.usableAmount
				if (res.data.obj.usableAmount < 100) {
					this.noClick = true
				}
			}
		},
		jump () {
			this.$router.push({'path': '/deposit'})
		}
	},
	watch: {
	}
}
</script>
<style lang="stylus" scoped>
.banner
	height 150px
	background-image url('../../images/bg-income.png')
	background-size cover
	background-position center
.num
	font-size: 40px
.pic
	width 75px
	height 20px
	img
		width 100%
		height 100%
.mask-center
	width 90%
	margin 0 auto
	padding 20px
	background #fff
	border-radius 10px
	transform translate(0,30%)
.dark
	position relative
	padding-left 15px
.dark:before
	content ''
	position absolute
	top 5px
	left 0
	width 7px
	height 7px
	border-radius 50%
	background rgb(61,155,255)
.row0
	margin 25px 0 35px 0
.row1
	margin-bottom 25px
button
  background-color #3d9bff
  border-radius 3px
  color #fff
  cursor pointer
  display inline-block
  letter-spacing 3px
  line-height 2
  padding 0 20px
  text-align center
  vertical-align middle
  text-decoration none
  white-space nowrap
  width 85%
	margin 30px auto 0px
</style>