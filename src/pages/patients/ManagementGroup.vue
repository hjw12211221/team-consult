<template lang='jade'>
  .management-group
    .add-group.primary.f16.p3.handle-border-bottom(@click='gropuAdd')
      icon-svg.pr2.primary.f2(iconClass='tianjia')
      span 添加分组
    .group-list
      .group-item.handle-border-bottom.p3
        span {{firstList.groupName}}
      .group-item(v-for='(x, index) in list' ,:key='index')
        div.w10(v-if='index !== 0' @click.stop='changeGroup(x)')
          mt-cell-swipe(:right="[{content: '删除',style: { background: 'red', color: '#fff' },handler: () => { deleteGroup(x.docId, x.groupId, index) }}]"  ,:title="x.groupName" )
            icon-svg.pr2.warning.f2(iconClass='shanchu' v-if='index!==0' @click.stop='showDelete(index)')
</template>
<script>
import { group, groupDelete, groupAdd, changeGroupName } from '@/http/getData'
import { CellSwipe, MessageBox } from 'mint-ui'
import { dom } from '@/configs/common'
export default {
	data () {
		return {
			list: [],
			firstList: []
		}
	},
	components: {
		mtCellSwipe: CellSwipe
	},
	mounted () {
		if (!this.$util.getVal('docInfo')) {
			this.$util.runToLogin('/managementGroup', this)
			return false
		}
		this.init()
	},
	methods: {
		async init () { // 获取分组
			const res = await group({'docId': this.$util.getVal('docInfo').sysDocId})
			if (res.data.code === '0') {
				this.list = res.data.list
				this.firstList = this.list[0]
			} else {
				this.$setHint({'val': res.data.msg})
			}
			this.$store.state.isLoding = false
		},
		showDelete (i) { //  显示删除按钮
			var left = dom('mint-cell-left')[i - 1]
			var warrpaer = dom('mint-cell-wrapper')[i - 1]
			var right = dom('mint-cell-right')[i - 1]
			left.style.transform = 'translate3d(-50px, 0px, 0px)'
			warrpaer.style.transform = 'translate3d(-50px, 0px, 0px)'
			right.style.cssText = 'transform:translate3d(0px, 0px, 0px)'
			right.style.transform = 'translate3d(0px, 0px, 0px)'
		},
		deleteGroup (docId, groupId, index) { //  弹出删除框
			MessageBox.confirm('确定执行此操作?').then(action => {
				this.delete(docId, groupId, index)
			}, action => {

			})
		},
		async delete (docId, groupId, index) {
			const res = await groupDelete({'docId': docId, 'groupId': groupId})
			if (res.data.code === '0') {
				this.$setHint({'val': '操作成功'})
				this.list.splice(index, 1)
			} else {
				this.$setHint({'val': res.data.msg})
			}
		},
		gropuAdd () { //  添加分组
			this.getFocus()
			MessageBox.prompt(' ', ' ', {inputPlaceholder: '添加分组'}).then(({ value, action }) => {
				if (value.length > 1) {
					this.add(value)
				}
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
		changeGroup (x) {	//	改变分组
			this.getFocus()
			MessageBox.prompt(' ', '修改分组 ', {'inputValue': x.groupName}).then(({ value, action }) => {
				if (value.length > 1) {
					this.changeName({'docId': x.docId, 'groupId': x.groupId, 'groupName': value})
				}
			}, ({ value, action }) => {

			})
		},
		async changeName (obj) {
			const res = await changeGroupName(obj)
			if (res.data.code === '0') {
				this.init()
			} else {
				this.$setHint({'val': res.data.msg})
			}
		},
		async add (val) {
			const res = await groupAdd({'docId': this.$util.getVal('docInfo').sysDocId, 'groupName': val})
			if (res.data.code === '0') {
				this.$setHint({'val': '添加成功'})
				this.init()
			} else {
				this.$setHint({'val': res.data.msg})
			}
		}
	}
}
</script>
<style lang='stylus' scoped>
  .svg-icon
    vertical-align bottom
  .group-list
    height 45px
    .group-item
      .mint-cell-title
        padding-left 0
</style>