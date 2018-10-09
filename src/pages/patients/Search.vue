<template lang='jade'>
.search.absolute.w10.top0.bottom0.bg-f5
	.search-content.flex.bg-white
		div.flex-max
			search-input(@searchVal='searchVal')
		.cancle(@click='$router.back()') 取消
	.search-list
		ul(v-if='list.length')
			li.p3.handle-border-top.bg-white(v-for='(j ,i) in list' @click='jumpInfo(j)')
				img.pr2.circel(src='../../images/defalu.png')
				span.pr3 {{j.userName}}
				span(v-if='j.remark') (	{{j.remark}}	)
</template>
<script>
import SearchInput from '@/childComponents/Input'
import { userSearch } from '@/http/getData'
import { dom } from '@/configs/common.js'
export default {
	data () {
		return {
			list: []
		}
	},
	mounted () {
		this.$store.state.isLoding = false
		this.$nextTick(() => {
			dom('input-patient')[0].focus()
		})
	},
	components: {
		SearchInput
	},
	methods: {
		async searchVal (val) {
			const res = await userSearch({'docId': this.$util.getVal('docInfo').sysDocId, 'searchKey': val})
			if (res.data.code === '0') {
				this.list = res.data.list
			} else {
				this.$setHint({'val': res.data.msg})
			}
		},
		jumpInfo (x) {
			this.$util.setCache('patientInfo', x)
			this.$router.push('/patientInfo')
		}
	}
}
</script>
<style lang='stylus' scoped>
.cancle
  padding-top 13px
  padding-right 15px
img
	width 25px
	vertical-align sub
</style>