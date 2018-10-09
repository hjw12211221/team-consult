<template lang="jade">
#addBank
	.fixed.right0.left0.top0
		.primary.f5.mx2 请绑定持卡人本人的银行卡
	.content
		.flex.p3.border-bottom.bg-white
			.flex-max 持卡人：
			.f4 {{bankUser}}
		router-link.flex.p3.border-bottom.bg-white.align-center(to="/selecBank")
			.flex-max 银行卡：
			.mr2 {{bankName}}
			icon-svg.c9(iconClass='arrow-right')
		.flex.p3.border-bottom.bg-white.align-center
			.flex-max 支行名称：
			input.text-right(type='type', placeholder="请输入支行名称", v-model="branchName")
		.flex.p3.border-bottom.bg-white.align-center
			.flex-max 银行卡号：
			input.text-right(type='number' placeholder="请输入您的银行卡号", v-model="bankCode")
	.text-center
		.btn.w9(@click="save") 保存
</template>
<script>
import { addBank } from '@/http/getData'
export default{
	components: {},
	data ()	{
		return {
			bankUser: this.$util.getVal('docInfo').docName || '',
			bankName: this.$route.query.bankName || '',
			branchName: '',
			bankCode: '',
			bankId: this.$route.query.bankId || ''
		}
	},
	mounted () {
		this.$store.state.isLoding = false
	},
	methods: {
		async initBank () {
			const res = await addBank({
				'advDocId': this.$util.getVal('docInfo').sysDocId,
				'advDocName': this.$util.getVal('docInfo').docName,
				'bankCode': this.bankCode,
				'branchName': this.branchName,
				'bankId': this.bankId
			})
			if (res.data.code === '0') {
				this.$router.push('/myBank')
			} else {
				this.$setHint({'val': res.data.msg})
			}
		},
		save () {
			if (this.bankName == '' || this.bankId == '') {
				this.$setHint({'val': '请先选择银行卡类型'})
			} else if (this.branchName == '') {
				this.$setHint({'val': '请先输入支行名称'})
			} else if (this.bankCode == '') {
				this.$setHint({'val': '请先输入银行卡号'})
			} else {
				this.initBank()
			}
		}
	},
	watch: {
	}
}
</script>
<style lang="stylus" scoped>
#addBank
	position absolute
	top 0
	bottom 0
	left 0
	right 0
	background #f1f1f1
.fixed
	height 35px
	line-height 35px
	background #d0e3f7
.content
	margin-top 35px
.btn
	margin-top 50px
	height 40px
	line-height 40px
	padding 0
input
	font-size 14px
	line-height 30px
</style>