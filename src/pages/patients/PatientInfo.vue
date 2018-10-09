<template lang='jade'>
.patient-info.absolute.bg-f5.w10.top0.bottom0
	.select-gruop.absolute.w10.top0.bottom0(v-if='showListGoup' @click='close')
		.content.bg-white.transform.absolute.rounder.w9.px3
			.text-center.py3.clear.title
				span.c0 选择分组
				span.add.primary.border-primary.border.float-r.round(@click.stop='gropuAdd') 添加
			.lists
				.item.handle-border-bottom(v-for='(x, index) in listGroup' @click.stop='selectGroup(x.groupId)')
					span {{x.groupName}}
					icon-svg.float-r.primary.f1.pt2(iconClass='dagou' v-if='groupId === x.groupId')
	div.bg-white
		.handle-border-bottom.p3.flex.justify-between
			.des.gray 姓名
			.result {{info.userName||''}}
		.handle-border-bottom.p3.flex.justify-between
			.des.gray 性别
			.result {{info.userSex ? (info.userSex === '1' ? '男' : '女' ) : ''}}
		.handle-border-bottom.p3.flex.justify-between
			.des.gray 年龄
			.result {{info.userAge||''}}
		.handle-border-bottom.p3.flex.justify-between
			.des.gray 备注
			.result
				input.text-right.pr1(placeholder='编辑患者备注名' v-model='remark')
				icon-svg.gray(iconClass='jiantou')
		.handle-border-bottom.p3.flex.justify-between
			.des.gray 患者分组
			.result(@click='showListGoup = true')
				span.pr1 {{groupName}}
				icon-svg.gray(iconClass='jiantou')
	.operation.fixed.px3.w10.text-center
		.bg-primary.white.rounder.keep(@click='keep') 保存
		.gray.mt4(@click='cancle') 删除患者

</template>
<script>
import { modify, group, groupAdd, cancleByDoc } from '@/http/getData'
import { MessageBox } from 'mint-ui'
import { closeDom } from '@/configs/common'
export default {
	data () {
		return {
			info: this.$util.getCache('patientInfo'),
			remark: '',
			groupName: '',
			isChangeRemark: false,	//	是否修改了备注
			showListGoup: false,
			groupId: ''
		}
	},

	components: {},

	computed: {},

	mounted () {
		this.$store.state.isLoding = false
		this.remark = this.info.remark
		this.groupName = this.info.groupName
		this.groupId = this.info.groupId
		if (!this.$util.getVal('docInfo')) {
			this.$util.runToLogin('/patientInfo', this)
			return false
		}
		this.getGroup()
	},

	methods: {
		async keep () {
			if (this.isChangeRemark) {	//	修改了备注，并且跟原来不一样
				const res = await modify({'docId': this.$util.getVal('docInfo').sysDocId, 'duId': this.info.duId, 'remark': this.remark, 'groupId': this.info.groupId})
				if (res.data.code === '0') {
					this.$setHint({'val': '保存信息成功', hideCallback: () => { this.$router.back() }})
				} else {
					this.$setHint({'val': res.data.msg})
				}
			} else {
				this.$setHint({'val': '保存信息成功', hideCallback: () => { this.$router.back() }})
			}
		},
		async getGroup (show) {	//	获取分组   如果有参数，说明是添加了新分组
			const res = await group({'docId': this.$util.getVal('docInfo').sysDocId})
			if (res.data.code === '0') {
				this.listGroup = res.data.list
				this.listGroup.filter((item) => this.groupId === item.groupId)
				if (show) {
					this.showListGoup = true
				}
			} else {
				this.$setHint({'val': res.data.msg})
			}
		},
		gropuAdd () { //  添加分组
			this.showListGoup = false
			this.getFocus()
			MessageBox.prompt(' ', ' ', {inputPlaceholder: '添加分组'}).then(({ value, action }) => {
				this.add(value)
			}, ({ value, action }) => {

			})
		},
		getFocus () {	//	ios手机点击输入框无法获取焦点
			setTimeout(() => {
				document.getElementsByClassName('mint-msgbox-input')[0].onclick = function () {
					document.querySelector('.mint-msgbox-input input').focus()
				}
			}, 200)
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
			const res = await modify({'docId': this.info.docId, 'duId': this.info.duId, 'groupId': groupId})
			if (res.data.code === '0') {	//	医生主动关注患者
				this.showListGoup = false
				this.groupName = res.data.obj.groupName
				this.groupId = res.data.obj.groupId
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
		},
		cancle () {
			MessageBox.confirm('删除患者后,该患者将移至陌生人').then(action => {
				this.cancleSure()
			}, action => {
			})
		},
		async cancleSure () {
			const res = await cancleByDoc({'docId': this.info.docId, 'duId': this.info.duId})
			if (res.data.code == 0) {
				this.$setHint({'val': '删除患者成功', hideCallback: () => { this.$router.back() }})
			} else {
				this.$setHint({'val': res.data.msg})
			}
		}
	},
	watch: {
		'remark' (val) {	//	判断用户是否改了备注，并且跟原来的不一样
			if (val === this.info.remark) {
				this.isChangeRemark = false
			} else {
				this.isChangeRemark = true
			}
		}
	}
}
</script>
<style lang='stylus' scoped>
input
	font-size 15px
.operation
	bottom 40px
	.keep
		height 40px
		line-height 40px
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