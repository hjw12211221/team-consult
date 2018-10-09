<template lang='jade'>
.msg-list
	.list.py2.handle-border-bottom.px3(v-for='(x, index) in list' @click='$router.push("/msgDetail/"+x.smsId)')
		.lastSms-detail {{x.sendContent}}
		.gray.py1 {{x.sendTime}}
</template>

<script>
import { msgList } from '@/http/getData'
export default {
	data () {
		return {
			list: [],
			pageNo: 1
		}
	},

	components: {},

	computed: {},

	mounted () {
		if (!this.$util.getVal('docInfo')) {
			this.$util.runToLogin('/msgList', this)
			return false
		}
		this.init()
	},
	methods: {
		async init () {
			const res = await msgList({'pageNo': this.pageNo, 'docId': this.$util.getVal('docInfo').sysDocId})
			if (res.data.code === '0') {
				res.data.obj.list.map(item => {
					item.lastSmsDetail.sendTime = this.$util.formatDate(new Date(item.lastSmsDetail.sendTime), 4)
					this.list.push(item.lastSmsDetail)
				})
			} else {
				this.$setHint({'val': res.data.msg})
			}
			this.$store.state.isLoding = false
		}
	}
}
</script>
<style lang='stylus' scoped>
</style>