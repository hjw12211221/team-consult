<template lang='jade'>
.select-patient
	.content
		.select-tab.text-center.py2.flex.relative.xy-center
			.tab-item.no-border-right(:class='{"select": index==0}' @click='changeIndex(0)') 全部
			.tab-item.no-border-left(:class='{"select": index==1}'  @click='changeIndex(1)') 分组
			.absolute.groupInfo.f16.right0.pr3(@click='$router.push("/msgList")') 群发记录
		.all-list.handle-border-top
			checklist(ref="checklist", :showIndex='index' ,:data-list="listInfo" ,:max="100"  @on-confirm="getSelectVal")
</template>

<script>
import checklist from './List.vue'
import { groupList, groupCreate } from '@/http/getData'
export default {
	data () {
		return {
			datas: [],	//  分组
			allList: [], //  所有患者
			listInfo: [],
			index: 0,
			value: []
		}
	},
	mounted () {
		if (!this.$util.getVal('docInfo')) {
			this.$util.runToLogin('/selectPatient', this)
			return false
		}
		this.init()
	},
	methods: {
		async init () {
			const group = await groupList({'docId': this.$util.getVal('docInfo').sysDocId})
			if (group.data.code === '0') {
				group.data.list.pop()			//	最后一个是陌生人，去除
				this.datas = group.data.list
				this.datas.map((item) => {
					item.duVoList.map((val) => {
						this.listInfo.push({
							label: val.userName,
							userId: val.userId,
							userName: val.userName,
							remark: val.remark || ''
						})
					})
					this.allList = this.listInfo
				})
			} else {
				this.$setHint({'val': group.data.msg})
			}
			this.$store.state.isLoding = false
		},
		async getSelectVal (val) {
			if (val.length > 100) {
				this.$setHint({'val': '一次最多群发100人'})
				return false
			}
			var userName =	''
			var userId = ''
			val.map(item => {
				userName += item.userName + '、'
				userId += item.userId + '、'
			})
			if (userName.length && userId.length) {
				const res = await groupCreate({'docId': this.$util.getVal('docInfo').sysDocId, 'userNames': userName, 'userIds': userId})
				if (res.data.code === '0') {
					//	跳转到群发消息页面
					this.$router.push('/msgDetail/' + res.data.obj.smsId)
				} else {
					this.$setHint({'val': res.data.msg})
				}
			} else {
				return false
			}
		},
		changeIndex (i) {
			if (i === 0) {
				this.listInfo = this.allList
			} else if (i === 1) {
				this.listInfo = this.datas
			}
			this.index = i
		}
	},
	components: { checklist }
}
</script>
<style lang='stylus' scoped>
.tab-item
	border 1px solid #3d9bff
	color #3d9bff
	font-size 16px
	border-radius 10px
	padding 4px 30px
	@media screen and (max-width:320px)
		font-size 13px
.no-border-left
	border-left 0
	border-top-left-radius 0
	border-bottom-left-radius 0
.no-border-right
	border-right 0
	border-top-right-radius 0
	border-bottom-right-radius 0
.select
	background-color #3d9bff
	color #fff
.groupInfo
	color rgb(102,102,102)
	@media screen and (max-width:320px)
		font-size 13px
img
	width 25px
	vertical-align sub
</style>
