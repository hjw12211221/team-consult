<template lang="jade">
#imgConsult
	.flex.p3.border-bottom.align-center.bg-white
		.flex-max 图文咨询
		mt-switch(v-model="open")
	.flex.p3.align-center.bg-white
		.flex-max 设置价格
		.c9
			input.round-min.indent10(type='number', v-model='times')
			span.ml2 元/次
	.p3
		.c9.my2 患者咨询说明：
		.f5.c9 患者购买一次咨询，48小时内可以向你咨询1个问题和追问5条消息，请合理设置价格
		.c9.mb2.mt4 设置价格参考：
		.f5.c9 主任医师50元/次；副任医师30元/次；
		.f5.c9 主治医师10元/次；医师5元/次；
	.fixed.bottom0.left0.right0
		.btn.w10(@click="save") 确认
</template>
<script>
import { imgConsult, myHome } from '@/http/getData'
export default{
	components: {},
	data ()	{
		return {
			open: false,
			times: '',
			docInfo: this.$util.getVal('docConsutlInfo')
		}
	},
	mounted () {
		this.$store.state.isLoding = false
		this.open = this.docInfo.isPay ? this.open = true : this.open = false
		this.times = this.docInfo.payPrice || ''
	},
	computed: {
		isOpen () {
			return this.open == true ? '1' : '0'
		},
		time () {
			return this.open == true ? this.times : ''
		}
	},
	methods: {
		async save () {
			this.$store.state.isLoding = true
			const res = await imgConsult({
				'advDocId': this.docInfo.sysDocId,
				'isOpen': this.isOpen,
				'payPrice': this.time,
				'docDuties': [{'advDocId': this.docInfo.sysDocId, 'dutyWeek': '周五', 'endTime': '20:00', 'startTime': '12:00'}]
			})
			if (res.data.code === '0') {
				this.$store.state.isLoding = false
				this.$util.setVal('isPay', res.data.obj.isPay)
				this.$util.setVal('payPrice', res.data.obj.payPrice)
				this.$setHint({'val': '设置成功'})
				setTimeout(() => {
					this.$router.push('/myHome')
				}, 2000)
			} else {
				this.$store.state.isLoding = false
				this.$setHint({'val': res.data.msg})
			}
		}
	},
	watch: {
		open (val) {
			if (val) {
				return false
			} else {
				this.times = ''
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
#imgConsult
	position absolute
	top 0
	bottom 0
	left 0
	right 0
	background #f1f1f1
input
	width 60px
	height 25px
	font-size 14px
	border 1px solid #ccc
.btn
	padding 0
	height 45px
	line-height 45px
	border-radius 0
</style>