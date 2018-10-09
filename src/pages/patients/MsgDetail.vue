<template lang='jade'>
	.msg-detail.bg-f5.absolute.w10.top0.bottom0
		.msg-title-content.bg-white.p3.fixed.top0.w10(ref='header')
			.content
				.gray 你将发消息给以下{{smsObj.sendNum}}位患者
				.rounder.p2.bg-e5.c9.mt2.people-list.omit3 {{smsObj.userNames}}
		.msg-container.p3.bg-f5(ref='msgContent')
			div(v-if='info')
				.flex.reverse.mt.msg-item(v-for='(x, index) in info')
					img.doc-icon(src='../../images/defalu.png')
					.bg-primary.white.round.px2.py1.mr1.msg.relative.text-right
						span.block.word-break(v-if='x.sendContent') {{x.sendContent}}
						img.block.w10(v-if='x.smsImage1', :src='x.smsImage1')
						.time.gray.absolute {{x.sendTime}}
		.fixed.bottom0.w10.bg-white.px3.py2.relative
			.flex
				.connectValue.px2.rounder20.flex-max.bg.needsclick(ref='connectValue' contenteditable="true"  @input='onInput' @click='setClient')
				icon-svg.f1.ml2.primary(iconClass='tianjia' v-if='showIncon' @click='sheetVisible = true')
				button.btn.btn-sm.ml2(v-if='!showIncon' @click='send',disable='true') 回复
			mt-actionsheet(:actions="actions",v-model="sheetVisible")
			div(v-if= "sheetVisible")
				.fixed.input0.left0.right0
						input(type="file", accept="image/*", capture='camera', @change="onFileChange")
				.fixed.input1.left0.right0
						input(type="file", accept="image/*" , @change="onFileChange")
</template>
<script>
import { smsDetail, addImg, smsSend } from '@/http/getData'
import { getImgBase, trim } from '@/configs/common'
export default {
	data () {
		return {
			showIncon: true,
			replyText: '',
			sheetVisible: false,
			actions: [
				{'name': '拍摄', 'method': this.myCamera},
				{'name': '相册', 'method': ''}
			],
			smsId: this.$route.params.smsId,
			smsInfoList: [],
			smsObj: {},
			requestResult: '',
			imgRUL: '',
			flag: false,
			info: ''
		}
	},

	components: {},

	computed: {},

	mounted () {
		if (!this.$util.getVal('docInfo')) {
			this.$util.runToLogin(`/msgDetail/${this.$route.params.smsId}`, this)
			return false
		}
		this.init()
	},

	methods: {
		async init () {
			const res = await smsDetail({'smsId': this.smsId, 'docId': this.$util.getVal('docInfo').sysDocId})
			if (res.data.code === '0') {
				this.smsInfoList = res.data.list
				this.smsObj = res.data.smsObj
				res.data.obj.map((item) => {
					item.sendTime = this.$util.formatDate(new Date(item.sendTime), 4)
				})
				this.info = res.data.obj
			} else {
				this.$setHint({'val': res.data.msg})
			}
			const header = this.$refs.header.clientHeight + 30
			this.$refs.msgContent.style.paddingTop = header + 'px'
			this.$nextTick(() => {
				document.documentElement.scrollTop = 10000
				document.body.scrollTop = 10000
			})
			this.$store.state.isLoding = false
		},
		onInput (e) {	//	获取inpiu里面的值
			this.replyText = e.target.innerText.replace(/<br>/g, '')
			if (this.replyText.length) {
				this.showIncon = false
			} else {
				this.showIncon = true
			}
		},
		setClient () {	//	改变input的位置， 因为ios上input被挡住了
			setTimeout(() => {
				document.documentElement.scrollTop = 10000
				document.body.scrollTop = 10000
			}, 300)
		},
		async onFileChange (e) {
			this.$store.state.isLoding = true
			getImgBase(e, addImg, this.success, this)	//	该方法会将 requestResult 重新复制
		},
		success () {	// 上传图片后
			this.$store.state.isLoding = false
			this.sheetVisible = false
			if (this.requestResult.data.code === '0') {
				this.imgRUL = this.requestResult.data.obj
				this.send()
			} else {
				this.$setHint({'val': this.requestResult.data.msg})
			}
		},
		async send () {
			this.flag = true
			var replyText = trim(this.replyText)	//	去除文本的空格
			if (replyText != '' || this.imgRUL) {
				const res = await smsSend({'sendContent': replyText, 'smsId': this.smsId, 'smsImage1': this.imgRUL})
				if (res.data.code === '0') {
					this.$setHint({'val': '成功'})
					this.init()
				} else {
					this.$setHint({'val': res.data.msg})
				}
				this.flag = false
				this.replyText = ''
				this.$refs.connectValue.innerText = ''
			} else {
				this.flag = false
				this.$setHint({'val': '请输入回复内容'})
			}
		}
	}
}
</script>
<style lang='stylus' scoped>
.doc-icon
	width 30px
	height 30px
	vertical-align sub
.msg
	margin-top 3px
	max-width 245px
.time
	top -25px
	right 0
	min-width 100px
	text-align right
.msg-container
	padding-top 0
	padding-bottom 55px
	.msg-item
		margin-top 40px
.connectValue
	min-height 25px
	padding-top 3px
	max-height 65px
	overflow auto
	-webkit-user-select text
button
	height 25px
.input0
	z-index 10001
	bottom 90px
	opacity 0
.input1
	z-index 10001
	bottom 45px
	opacity 0
input
	width 100%
	height 45px
.people-list
	max-height 74px
.word-break
	word-break break-all
</style>