<template lang="jade">
#deposit
	.px2.py4.border-bottom.align-center.mx2
		span.f4 提现金额
		span.ml1
			input(:placeholder="'可提现' + usableAmount >= 100 ? usableAmount : '0' + '元'", v-model="num" type='number')
		span 元
	.flex.f5.p2
		.flex-max.c9 可提现{{usableAmount >= 100 ? usableAmount : '0'}}元
		.primary(@click="allTrun") 全部提现
	.p2.border-bottom.c9.f5.bg 请选择提现汇款的银行卡
	.p3.border-bottom 持卡人：{{bankUser}}
	.flex.p3.border-bottom(@click="show")
		.f4 银行卡：
		.flex-max {{bankName || ''}}
		icon-svg.c9(iconClass='arrow-right')
	.fixed.bottom0.left0.right0
		.btn.w10(@click="next") 下一步
	.mask(v-if="mask",@click="mask=!mask")
		.mask-bottom(id="cards")
			.flex.p2.border-bottom.align-center(v-for="x in bankList", @click="selecBank(x)",v-if="bankList")
				.pic.mr2
					img.block.w10(:src="x.bankLogo")
				.flex-max
					.mb1 {{x.bankName}}
					.dark {{x.bankCode | fileBank}}
			router-link.flex.p2.border-bottom.align-center.justify-center(to="/addBank")
				icon-svg.f1.ml2.primary(iconClass='tianjia')
				.primary.ml2 添加银行卡
</template>
<script>
import { myBank, myIncome, deposit } from '@/http/getData'
export default{
	components: {},
	data ()	{
		return {
			mask: false,
			num: '', // 输入金额
			bankList: [], // 银行卡列表
			bankName: '', // 当前银行卡名
			usableAmount: '', // 账户现金额
			bankBranch: '', // 银行分支
			bankCardNo: '', // 银行卡号
			bankUser: ''
		}
	},
	mounted () {
		this.$store.state.isLoding = false
		this.initData()
	},
	methods: {
		async initData () {
			const res = await myBank({'advDocId': this.$util.getVal('docInfo').sysDocId})
			if (res.data.code === '0') {
				if (res.data.list.length > 0) {
					this.bankList = res.data.list
					this.bankCardNo = this.bankList[0].bankCode
					this.bankName = this.bankList[0].bankName
					this.bankBranch = this.bankList[0].branchName
					this.bankUser = this.bankList[0].advDocName
				}
			} else {
				this.$setHint({'val': res.data.msg})
			}
			const incomes = await myIncome({'docId': this.$util.getVal('docInfo').sysDocId})
			if (incomes.data.code === '0') {
				this.usableAmount = incomes.data.obj.usableAmount
			} else {
				this.$setHint({'val': res.data.msg})
			}
		},
		show () {
			this.mask = true
			// setTimeout(() => {
			// 	document.getElementById('cards').style.height = 'auto'
			// }, 200)
		},
		selecBank (val) {
			this.bankName = val.bankName
			this.bankBranch = val.branchName
			this.bankCardNo = val.bankCode
		},
		allTrun () {
			if (this.usableAmount >= 100) {
				this.num = this.usableAmount
			} else {
				this.num = ''
			}
		},
		next () {
			var reg = /^\d+(\.\d+)?$/
			if (!this.num) {
				this.$setHint({'val': '提现金额为空'})
			} else if (isNaN(this.num)) {
				this.$setHint({'val': '请输入正确金额'})
			} else if (!reg.test(this.num)) {
				this.$setHint({'val': '请输入正确金额'})
			} else if (this.num < 100) {
				this.$setHint({'val': '提现金额小于100元'})
			} else if (this.num > this.usableAmount) {
				this.$setHint({'val': '提现金额不足'})
			} else {
				this.$util.setCache('depositObj', {'amount': this.num, 'bankName': this.bankName, 'bankBranch': this.bankBranch, 'bankCardNo': this.bankCardNo})
				this.$router.push('/testPhone')
			}
		}
	},
	watch: {
	},
	filters: {
		fileBank (val) {
			var leng = val.length
			return '**** **** ****' + val.slice(leng - 4)
		}
	}
}
</script>
<style lang="stylus" scoped>
.btn
	padding 0
	height 45px
	line-height 45px
.mask-bottom
	position absolute
	bottom 0
	left 0
	right 0
	background #fff
.pic
	width 30px
.indent10
	margin-top 3px
input
	width 50px
	font-size 14px
span
	display inline-block
	vertical-align middle
</style>