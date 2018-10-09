<template lang="jade">
#myBank
	.flex.p3.border-bottom.bg-white
		.flex-max 绑定提现银行卡
		router-link.primary(to="/addBank") 添加
	.flex.p2.border-bottom.align-center.bg-white(v-for="x in bankList",@click="show(x)")
		.pic.mr2
			img.block.w10(:src="x.bankLogo")
		.flex-max
			.mb1 {{x.bankName}}
			.dark {{x.bankCode | bankCart}}
</template>
<script>
import { myBank, delecBank } from '@/http/getData'
import { MessageBox } from 'mint-ui'
export default{
	components: {
		MessageBox
	},
	data ()	{
		return {
			bankList: [],
			mask: false
		}
	},
	mounted () {
		this.initData()
	},
	methods: {
		async initData () {
			const res = await myBank({'advDocId': this.$util.getVal('docInfo').sysDocId})
			if (res.data.code === '0') {
				this.$store.state.isLoding = false
				this.bankList = res.data.list
			} else {
				this.$setHint({'val': res.data.msg})
			}
		},
		show (val) {
			this.mask = true
			MessageBox.confirm('是否解除该银行卡的绑定?').then(action => {
				this.mask = false
				this.delec(val)
			}, action => {})
		},
		async delec (val) {
			console.log(val.bankCode)
			const res = await delecBank({'id': val.id})
			if (res.data.code === '0') {
				this.$setHint({'val': '该银行卡已解除'})
				this.initData()
			} else {
				this.$setHint({'val': res.data.msg})
			}
		}
	},
	watch: {
	},
	filters: {
		bankCart (val) {
			var leng = val.length
			return '**** **** ****' + val.slice(leng - 4)
		}
	}
}
</script>
<style lang="stylus" scoped>
#myBank
	position absolute
	top 0
	bottom 0
	left 0
	right 0
	background #f1f1f1
.primary
	width 60px
	height 20px
	line-height 20px
	border 1px solid #3d9bff
	border-radius 20px
	text-align center
.pic
	width 30px
</style>