<template lang="jade">
	#consultList.wrapper(ref="wrapper")
		.flex.py3.text-center.handle-border-bottom
			.w33.relative(v-for="(x,index) in tabName",:class="tab == index?'primary-bottom':''" @click="tabType(index)") {{x.name}}
				.titleDot.absolute(v-if="noReading>0 && index==0")
				.titleDot.absolute(v-if="noReadings && index==1")
			//- 正在咨询
		.block.p2.handle-border-bottom(v-for="(s,index) in isConsult",v-if="tab == '0'",:key="index",@click="jump(s)")
			.flex
				.relative {{s.patientName}} &nbsp;{{s.userSex | sex}}&nbsp; {{s.userAge}}岁
					.dot.absolute(v-if="s.consultStatus == '0'")
				.flex-max.gray.text-right {{s.replyTime}}
			.gray.mt1.omit2 {{s.lastReplyContent || s.consultContent}}
			//- 团队咨询
		.block.p2.handle-border-bottom(v-for="(s,index) in isConsult",v-if="tab == 1",:key="index",@click="jump(s)")
			.flex
				.relative {{s.patientName}} &nbsp;{{s.userSex | sex}}&nbsp; {{s.userAge}}
					.pic.absolute(v-if="!s.advDocId")
						img.block.w10(src="../../images/q.png")
				.flex-max.gray.text-right {{s.replyTime}}
			.gray.mt1.omit2(v-if="!s.advDocId") {{s.consultContent}}
			.gray.mt1.omit2(v-else) {{s.lastReplyContent || s.consultContent}}
			//- 历史咨询
		.block.p2.handle-border-bottom(v-for="(s,index) in isConsult",v-if="tab == 2",:key="index",@click="jump(s)")
			.flex.align-center
				.relative.w6
					span.v-middle {{s.patientName}}
					span.mx2.v-middle {{s.userSex | sex}}
					span.v-middle {{s.userAge}}
				.flex-max.gray.text-right {{s.replyTime}}
			.gray.mt1.omit2 {{s.lastReplyContent || s.consultContent}}
		//- .bg.text-center.py1.primary(v-if="!isLoading") 已没更多内容了
		.bg.text-center.py1.primary(v-if="isLoading") 加载中...
</template>
<script>
import { consultList } from '@/http/getData'
import BScroll from 'better-scroll'
export default{
	components: {},
	data ()	{
		return {
			tab: '',
			noReading: 0,
			noReadings: false,
			tabName: [
				{'name': '正在咨询'},
				{'name': '团队咨询'},
				{'name': '历史咨询'}
			],
			isConsult: [],
			pageNo: 1,
			pageSize: 10,
			allpage: '',
			isLoading: false,
			scrolls: null
		}
	},
	mounted () {
		if (!this.$util.getVal('docInfo')) {
			this.$util.runToLogin('/consultList', this)
			return false
		}
		if (this.$util.getVal('weChat') && this.$util.getVal('weChat') != null) {
		} else {
			this.$util.initData()
		}
		if (this.$util.getCache('tab')) {
			this.tab = this.$util.getCache('tab')
			if (this.$util.getCache('tab') == 1) {
				this.initData(3, this.pageNo)
			} else {
				this.initData(this.tab, this.pageNo)
			}
		} else {
			this.tab = 0
			this.initData(this.tab, this.pageNo)
		}
		this.scroll()
	},
	methods: {
		scroll () {
			window.onscroll = () => {
				if (document.scrollingElement.scrollTop + document.documentElement.clientHeight >= document.scrollingElement.scrollHeight) {
					this.pageNo++
					if (this.pageNo <= this.allpage) {
						this.isLoading = true
						this.initData(this.tab, this.pageNo)
					}
				}
			}
		},
		async initData (val, page) {
			this.$store.state.isLoding = true
			const res = await consultList({
				'advDocId': this.$util.getVal('docInfo').sysDocId,
				'advMark': val,
				'pageNo': page,
				'pageSize': this.pageSize
			})
			if (res.data.code === '0') {
				this.$store.state.isLoding = false
				this.noReading = res.data.notReplyCount
				res.data.obj.list.forEach((val) => {
					val.replyTime = this.$util.formatDate(new Date(val.replyTime), 2)
					val.createTime = this.$util.formatDate(new Date(val.createTime), 2)
				})
				this.isConsult = [...this.isConsult, ...res.data.obj.list]
				console.log(this.isConsult)
				this.allpage = res.data.obj.pages
				this.isLoading = false
				// this.$nextTick(() => {
				// 	this.scrolls = new BScroll(this.$refs.wrapper, {
				// 		click: true
				// 	})
				// })
				// setTimeout(() => {
				// 	this.scrolls.refresh()
				// }, 200)
			} else {
				this.$store.state.isLoding = false
				this.$setHint({'val': res.data.msg})
			}
			const re = await consultList({
				'advDocId': this.$util.getVal('docInfo').sysDocId,
				'advMark': 3,
				'pageNo': page,
				'pageSize': this.pageSize
			})
			if (re.data.code === '0') {
				re.data.obj.list.forEach((val) => {
					if (!val.advDocId) {
						this.noReadings = true
					}
				})
			}
		},
		tabType (index) {
			this.tab = index
			this.isConsult = []
			this.pageNo = 1
			this.noReading = 0
			if (this.tab == 1) {
				this.initData(3, this.pageNo)
			} else {
				this.initData(this.tab, this.pageNo)
			}
		},
		jump (val) {
			if (this.tab == 0) {
				this.$util.setCache('tab', 0)
				this.$router.push(`/teamConsult/${val.consultId}?isConsult=0`)
			} else if (this.tab == 1) {
				this.$util.setCache('tab', 1)
				if (val.advDocId) {
					this.$router.push(`/teamConsult/${val.consultId}`)
				} else {
					this.$router.push(`/consultDetail/${val.consultId}`)
				}
			} else if (this.tab == 2) {
				this.$util.setCache('tab', 2)
				this.$router.push(`/teamConsult/${val.consultId}?history=1`)
			}
		}
	},
	beforeRouteLeave (to, from, next) {
		window.onscroll = ''
		next()
	},
	filters: {
		sex (val) {
			if (val == '1') {
				return '男'
			} else {
				return '女'
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
// .primary
// 	position relative
.router-link-active
   text-decoration none
.primary-bottom:after
	content ''
	position absolute
	bottom -15px
	// left 50%
	// margin-left -15px
	width 30px !important
	height 3px
	background rgb(61,155,255)
.titleDot{
	top 50%
	right 15px
	width 8px
	height 8px
	margin-top -11px
	background red
	border-radius 50%
}
.dot
	top 50%
	right -15px
	width 8px
	height 8px
	margin-top -4px
	background red
	border-radius 50%
.pic
	top 50%
	right -20px
	width 15px
	height 15px
	margin-top -6px
</style>
