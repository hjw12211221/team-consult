<template lang='jade'>
	.patient-content
		mt-loadmore.loading(:top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore")
			div.mint-loadmore-top(slot="top")
				span(v-show="topStatus === 'pull'",:class="{ 'rotate': topStatus === 'drop' }") ↓
				span(v-show="topStatus === 'drop'") 释手刷新...
				span(v-show="topStatus === 'loading'") Loading...
			div(@click='$router.push("/search")')
				search
			.patient-list
				.new-user.handle-border-bottom.f16.p3(@click='$router.push("/newPatient")')
					span 新关注患者
					icon-svg.float-r.c9(iconClass='arrow-right')
				.grou.f16.p3(@click='$router.push("/selectPatient")')
					span 群发消息
					icon-svg.float-r.c9(iconClass='arrow-right')
				.patient-list
					.item.f16(v-for='(x, index) in datas')
						div.handle-border-bottom.p3.relative(@click='changeItem(index)')
							icon-svg.c9(iconClass='arrow-right' v-if='showItem !== index')
							icon-svg.c9(iconClass='jiantou-copy-copy' v-if='showItem === index')
							span.pl2 {{x.groupName}}	( {{x.duVoList.length}} )
							.absolute.group-icon(v-if='index === 0' @click.top='$router.push("/managementGroup")')
								img(src='../../images/group.png')
								span 分组
						ul(v-if='showItem === index')
							li.p3(v-for='(j ,i) in x.duVoList' @click='jumpInfo(j)' ,:class='{"handle-border-bottom": i === x.duVoList.length-1}')
								img.pr2.circel(src='../../images/defalu.png')
								span.pr3 {{j.userName}}
								span(v-if='j.remark') (	{{j.remark}}	)
			mt-actionsheet(:actions="actions" v-model="sheetVisible" cancelText='取消')
</template>

<script>
import search from '@/childComponents/Input'
import { groupList } from '@/http/getData'
import { Loadmore, Actionsheet } from 'mint-ui'
export default {
	data () {
		return {
			datas: [],	//  分组
			showItem: '',
			topStatus:	'',		//	下拉的状态
			timeout:	'',	//	定时器
			actions: [{'name': '分组管理', 'method': this.showChangeGropu}],
			sheetVisible: false
		}
	},
	components: {
		search,
		mtLoadmore: Loadmore,
		mtActionsheet: Actionsheet
	},

	computed: {},

	mounted () {
		if (!this.$util.getVal('docInfo')) {
			this.$util.runToLogin('/patient', this)
			return false
		}
		if (this.$util.getVal('weChat') && this.$util.getVal('weChat') != null) {
		} else {
			this.$util.initData()
		}
		this.init()
	},
	methods: {
		async init () {
			const group = await groupList({'docId': this.$util.getVal('docInfo').sysDocId})
			if (group.data.code === '0') {
				group.data.list.pop()			//	最后一个是陌生人，去除
				this.datas = group.data.list
			} else {
				this.$setHint({'val': group.data.msg})
			}
			this.$store.state.isLoding = false
			this.$refs.loadmore.onTopLoaded()
		},
		handleTopChange (status) {		//	下拉改变的状态
			this.topStatus = status
		},
		loadTop () {		//  结束下拉动作的时候更新页面
			this.init()
		},
		showChangeGropu () {		//	点击分组管理
			this.$router.push('/managementGroup')
		},
		changeItem (i) { //  点击分组的时候
			if (this.showItem === i) {
				this.showItem = ''
			} else {
				this.showItem = i
			}
		},
		jumpInfo (val) {	//	去患者资料页面
			this.$util.setCache('patientInfo', val)
			this.$router.push('/patientInfo')
		}
	}
}
</script>
<style lang='stylus' scoped>
.f16
	font-size 16px
.c9
	color #999
.new-user
	border-top 10px solid #f5f5f5
.patient-content
	min-height 667px
	.loading
		min-height 667px
.grou
	border-bottom 10px solid #f5f5f5
img
	width 25px
	vertical-align sub
.group-icon
	right 15px
	top 50%
	transform translate(0,-50%)
	img
		width 15px
		vertical-align middle
	span
		font-size 15px
		padding-left 5px
		color #a09e9e
</style>