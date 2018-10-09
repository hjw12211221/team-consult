<template lang="jade">
#teamList
	router-link.flex.p3.bg-white(v-for="(x,index) in list",:to="'/myTeam/'+x.teamId",:key="index")
		.flex-max {{x.teamName}}
		icon-svg.c9(iconClass='arrow-right')
</template>
<script>
import { teamList } from '@/http/getData'
export default{
	components: {},
	data ()	{
		return {
			list: []
		}
	},
	mounted () {
		this.initData()
	},
	methods: {
		async initData () {
			const res = await teamList({'advDocId': this.$util.getVal('docInfo').sysDocId})
			if (res.data.code === '0') {
				this.$store.state.isLoding = false
				this.list = res.data.obj
			} else {
				this.$store.state.isLoding = false
				this.$setHint({'val': res.data.msg})
			}
		}
	},
	watch: {
	}
}
</script>
<style lang="stylus" scoped>
#teamList
	position absolute
	top 0
	bottom 0
	left 0
	right 0
	background #f1f1f1
</style>