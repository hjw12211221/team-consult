<template lang="jade">
#selecBank
	.flex.p2.border-bottom.align-center(@click="back(x)", v-for="x in typeList")
		.mr2.img
			img.block.w10(:src="x.bankLogo")
		.f4 {{x.bankName}}
</template>
<script>
import { bankType } from '@/http/getData'
export default{
	components: {},
	data ()	{
		return {
			typeList: []
		}
	},
	mounted () {
		this.$store.state.isLoding = false
		this.initData()
	},
	methods: {
		async initData () {
			const res = await bankType()
			if (res.data.code === '0') {
				this.typeList = res.data.list
			}
		},
		back (val) {
			this.$router.push({'path': '/addBank', query: {'bankId': val.bankId, 'bankName': val.bankName}})
		}
	},
	watch: {
	}
}
</script>
<style lang="stylus" scoped>
.img
	width 40px
</style>