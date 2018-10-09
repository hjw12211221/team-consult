<template lang='jade'>
.list
	.select-gruop.absolute.w10.top0.bottom0(v-if='showListGoup' @click='close')
		.content.bg-white.transform.absolute.rounder.w9.px3
			.text-center.py3.clear.title
				span.c0 选择分组
				span.add.primary.border-primary.border.float-r.round(@click.stop='gropuAdd') 添加
			.lists
				.item.handle-border-bottom(v-for='(x, index) in listGroup' @click.stop='selectGroup(x.groupId)')
					span {{x.groupName}}
					icon-svg.float-r.primary.f1.pt2(iconClass='dagou' v-if='selectIndex === x.groupId')
	ul(v-if='list.length')
		li.p3.handle-border-top.bg-white(v-for='(j ,i) in list')
			img.pr2.circel(src='../../images/defalu.png')
			span.pr3 {{j.userName}}
			span.pr3 {{j.userSex == 1 ? '男' : '女'}}
			span {{j.userAge}}
			span.float-r.gray.guanzhu(:class='{"follow": j.docIsFollow == 0}' @click='follow(j.docIsFollow, j.docId, j.userId, j.duId)') {{j.docIsFollow == 1 ? '已关注' : '关注'}}
</template>
<script>
import { listNew, followByDoc, group, groupAdd } from '@/http/getData'
import { MessageBox } from 'mint-ui'
import { closeDom } from '@/configs/common'
export default {
	data () {
		return {
			list: [],
			listGroup: [], //  分组
			showListGoup: false,	//	分组列表
			selectIndex: 0,
			info: {'docId': '', 'userId': '', 'duId': ''}	//	用户编号	,医患编号
		}
	},
	mounted () {
		if (!this.$util.getVal('docInfo')) {
			this.$util.runToLogin('/newPatient', this)
			return false
		}
		this.init()
		this.getGroup()
	},
	methods: {
		async init () { //  获取新关注患者列表
			const res = await listNew({'docId': this.$util.getVal('docInfo').sysDocId})
			if (res.data.code === '0') {
				this.list = res.data.list
			} else {
				this.$setHint({'val': res.data.msg})
			}
			this.$store.state.isLoding = false
		},
		async follow (id, docId, userId, duId) { // 医生主动关注患者
			if (id === '0') {
				this.showListGoup = true
				this.info = {'docId': docId, 'userId': userId, 'duId': duId}	//	存储用户id 跟医患编号
				const res = await followByDoc({...this.info, 'groupId': this.selectIndex})
				this.init()
			} else {
				return false
			}
		},
		async getGroup (show) {	//	获取分组   如果有参数，说明是添加了新分组
			const res = await group({'docId': this.$util.getVal('docInfo').sysDocId})
			if (res.data.code === '0') {
				this.listGroup = res.data.list
				if (show) {
					this.showListGoup = true
				}
			} else {
				this.$setHint({'val': res.data.msg})
			}
		},
		gropuAdd () { //  添加分组
			this.showListGoup = false
			MessageBox.prompt(' ', ' ', {inputPlaceholder: '添加分组'}).then(({ value, action }) => {
				this.add(value)
			}, ({ value, action }) => {

			})
		},
		async add (val) {
			const res = await groupAdd({'docId': this.$util.getVal('docInfo').sysDocId, 'groupName': val})
			if (res.data.code === '0') {	//	添加分组成功后，从新掉分组的接口
				this.getGroup('showList')
			} else {
				this.$setHint({'val': res.data.msg})
			}
		},
		async selectGroup (groupId) {	//	选择分组
			this.selectIndex = groupId
			const res = await followByDoc({...this.info, 'groupId': this.selectIndex})
			if (res.data.code === '0') {	//	医生主动关注患者
				this.showListGoup = false
				this.$setHint({'val': '添加成功'})
				this.init()
				this.getGroup()
			} else {
				this.$setHint({'val': res.data.msg})
			}
		},
		close (e) {	//	关闭遮罩层
			var result = closeDom(e, 'select-gruop')
			if (result) {
				this.showListGoup = false
			} else {
				return false
			}
		}
	}
}
</script>
<style lang='stylus' scoped>
img
	width 25px
	vertical-align bottom
.follow
	border 1px solid #3d9bff
	color #3d9bff
	padding 2px 5px
	border-radius 5px
.guanzhu
	padding-top 3px
.select-gruop
	background rgba(0, 0, 0, 0.4)
	z-index 1000
	.title
		span:first-child
			position relative
			top 2px
		.add
			padding 1px 10px
.lists
	.item
		height 45px
		line-height 45px
		.mint-cell-title
			padding-left 0
</style>