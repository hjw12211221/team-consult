<template lang="jade">
	#teamConsult
		div(v-if="info")
			.bg-white
				.flex.py3.border-bottom.mx2
					.flex-max {{info.patientName}} {{info.userSex | sex}} {{info.userAge}}岁
					.gray {{info.createTime}}
			.p2.bg-white.bottom_bg
				div {{info.consultContent}}
				.flex.py2(v-if="info.consultImg || info.consultImg2 || info.consultImg3")
					.w33(v-if="info.consultImg",style="height:90px")
						img.block.w10.h10(:src="info.consultImg",@click="reading(info.consultImg,'1')")
					.mx2.w33(v-if="info.consultImg2",style="height:90px")
						img.block.w10.h10(:src="info.consultImg2",@click="reading(info.consultImg2,'1')")
					.w33(v-if="info.consultImg3",style="height:90px")
						img.block.w10.h10(:src="info.consultImg3",@click="reading(info.consultImg3,'1')")
		#content.content.relative.bg.mt2
			audio(src="")
			div(v-for="(x,index) in chatList")
				.flex.my30.justify-end.px2(v-if="x.replierType==1")
					.const-content
						.f5.text-right.mb1.c9 {{x.replyName}}
							//- span(v-if='x.isDuty') (负责医生)
						.word.px2.py1.rounder.bg-primary.white(v-if="x.replyContent") {{x.replyContent}}
						.Imgcontent.p2.rounder(v-if="x.replyImg1")
							img(:src="x.replyImg1", @click="reading(x.replyImg1,'2')")
						.Voice.flex.justify-end(v-if="x.media", @click="palyAudio(x,index)")
							.sound.flex.align-center.justify-end
								img.block.mr2(src="../../images/left.gif",v-if="ispaly && vioceIndex == index")
								img.block.mr2(src="../../images/left.png",v-else)
					.absolute.left0.right0.text-center.f5.gray.time {{x.createTime}}
					.relative.w2.ml2.circle
						.absolute.white.bg-primary.f5.title(v-if="x.isDuty") 负责
						img.block.circle(:src="x.docAvatar")
				.flex.my30.px2(v-else)
					.w2.mr2.circle.overflow
						img.block(src="../../images/defalu.png")
					.const-content
						.f5.mb1 患者
						.word.bg-white.px2.py1.rounder(v-if="x.replyContent") {{x.replyContent}}
						.Imgcontent.p2.rounder(v-if="x.replyImg1")
							img(:src="x.replyImg1", @click="reading(x.replyImg1,'2')")
						.Voice.flex.justify-end(v-if="x.media", @click="palyAudio(x)")
							.sound.flex.align-center
								img.block.mr2(src="../../images/left.gif",v-if="ispaly && vioceIndex == index")
								img.block.mr2(src="../../images/left.png",v-else)
						//- img.block(src="../../images/defalu.png")
					.absolute.right0.left0.text-center.f5.gray.time {{x.createTime}}
			.fixed.p2.bg-white.left0.right0.bottom0(v-if="!history",:class="{'pb45':fouce}")
				.flex.align-center
					//- .input.flex-max.indent20(contenteditable, placeholder="请输入文字",style="height:30px;line-height:30px;border:1px solid #eee")
					//- textarea.flex-max.indent10(v-model="content", @focus="changeH", @blur="fouce=false",placeholder="请输入回复内容")
					.w1.text-center(@click="show =! show")
						icon-svg.f1.primary(iconClass='tianjia')
					.connectValue.flex-max.indent10.px2.rounder20.bg.needsclick(ref="connectValue",contenteditable="true"  @input='onInput' @click='setClient')
					//- input.rounder20.bg.indent20.flex-max(style="height:30px;line-height:30px",placeholder="请输入回复内容")
					.btn.ml2(@click="send('')") 发送
				transition(name="bottom-fade")
					.flex.align-center.py4(v-if="show")
						.w25.m2.text-center.gray.relative(@click='myChange')
							icon-svg.f1(iconClass='picture')
							.f5.mt2 照片
							//- input(type="file", accept="image/*", @change="myChange")
						.w25.m2.text-center.gray.relative(@click='myChange')
							icon-svg.f1(iconClass='paishexuanzhong')
							.f5.mt2 拍摄
							//- input(type="file", accept="image/*", @change="myChange")
			//- .mask(v-if="mask", @click="mask = !mask")
			//- 	.mask-center.w9
			//- 		img(:src="imgSrc")
</template>
<script>
import { replyList, addChart, addImg } from '@/http/getData'
import { readImgs, trim, WecharImg } from '@/configs/common'
export default{
	components: {},
	data ()	{
		return {
			history: this.$util.getQstr('history') || '',
			chatList: [],
			info: '',
			show: false,
			fouce: false,
			consultId: this.$route.params.consultId,
			mask: false,
			content: '',
			advDocId: '',
			userId: '',
			ispaly: false,
			vioceIndex: 0,
			charInterval: ''
		}
	},
	mounted () {
		this.initData()
		this.charInterval = setInterval(() => { this.initData(0) }, 30000)
	},
	methods: {
		async initData (val) {
			const res = await replyList({'consultId': this.consultId})
			if (res.data.code === '0') {
				this.$store.state.isLoding = false
				const advDocId = res.data.obj.advDocId
				const consultType = res.data.obj.consultType
				res.data.consultReplyList.forEach((val) => {
					if (consultType === '3' && val.advDocId == advDocId) {
						val.isDuty = true	//	责任医生
					}
					if (consultType != '3') {
						this.$util.setTitle('图文咨询')
					}
					val.createTime = this.$util.formatDate(new Date(val.createTime), 2)
				})
				this.chatList = res.data.consultReplyList
				res.data.obj.createTime = this.$util.formatDate(new Date(res.data.obj.createTime), 2)
				this.info = res.data.obj
				this.advDocId = advDocId
				this.userId = res.data.obj.userId
				// 初始化页面到到聊天的底部
				if (val != '0') {
					// var img =  new img()
					var imgs = []
					var flag = 0
					var mulitImg = [] // 定义一个空数组来存储聊天所有的图片
					res.data.consultReplyList.forEach((val, index) => {
						if (val.replyImg1) {
							mulitImg.push(val.replyImg1)
						}
					})
					var imgTotal = mulitImg.length
					for (var i = 0; i < imgTotal; i++) {
						imgs[i] = new Image()
						imgs[i].src = mulitImg[i]
						imgs[i].onload = () => {
						// 第i张图片加载完成
							flag++
							if (flag == imgTotal) {
								// 全部加载完成
								// this.$nextTick(() => {
								// this.scrollPosition()
								document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight - document.documentElement.clientHeight
								// })
							}
						}
					}
					if (mulitImg.length == 0) {
						this.$nextTick(() => {
							document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight
						})
					}
				}
			} else {
				this.$setHint({'val': res.data.msg})
			}
		},
		reading (cutter, type) {
			if (type == '1') {
				var arry = [this.info.consultImg, this.info.consultImg2, this.info.consultImg3].filter(item => !!item)
				readImgs(cutter, arry)
			} else {
				readImgs(cutter, [cutter])
			}
		},
		async send (imgFile) {
			if (this.$util.getQstr('isConsult') == '0') {
				if (this.$util.getQstr('advDocId')) {
					if (this.$util.getQstr('advDocId') != this.$util.getVal('docInfo').sysDocId) {
						this.$setHint({'val': '该医生无法回复'})
						return false
					}
				}
			}
			if (this.content == '' && imgFile == '') {
				this.$setHint({'val': '发送内容不能为空'})
				return false
			} else {
				const res = await addChart({
					'consultId': this.consultId,
					'userId': this.userId,
					'advDocId': this.$util.getVal('docInfo').sysDocId,
					'replierType': 1,
					'replyContent': this.content,
					'replyImg1': imgFile
				})
				if (res.data.code === '0') {
					this.$refs.connectValue.innerText = ''
					this.content = ''
					this.show = false
					this.$setHint({'val': '发送成功'})
					this.initData()// 刷新聊天
					this.$nextTick(() => {
						document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight - document.documentElement.clientHeight
					})
				} else {
					this.$setHint({'val': res.data.msg})
				}
			}
		},
		myChange () {
			WecharImg(this.success, this)
		},
		success (imgSrc) {
			this.send(imgSrc)
		},
		palyAudio (x, index) {
			this.vioceIndex = index
			var ax = document.querySelector('audio')
			// console.log(ax)
			if (ax !== null) {
				if (ax.paused) {
					ax.src = x.transMedia
					this.ispaly = true
					ax.play()
				} else {
					this.ispaly = false
					ax.pause()
				}
			}
			ax.addEventListener('ended', () => {
				// window.clearInterval(timeid)
				this.ispaly = false
			})
		},
		onInput (e) {
			this.content = trim(e.target.textContent)
			// console.log(this.content, this.content.length)
		},
		setClient () {
			this.show = false
			setTimeout(() => {
				document.documentElement.scrollTop = 10000
				document.body.scrollTop = 10000
			}, 300)
		},
		scrollPosition () {
			setTimeout(() => {
				document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight - document.documentElement.clientHeight
			}, 200)
		}
	},
	watch: {
	},
	filters: {
		sex (val) {
			if (val == '1') {
				return '男'
			} else {
				return '女'
			}
		}
	},
	destroyed: function () {
		window.clearInterval(this.charInterval)
	}
}
</script>
<style lang="stylus" scoped>
	#teamConsult
		position absolute
		top 0
		bottom 0
		left 0
		right 0
		background-color #eee
	.my30
		margin-top 30px
		margin-bottom 30px
	.bottom-fade-enter
		animation: bounce-in .5s;
	.slide-fade-leave-to
		animation: bounce-in .5s reverse
	@keyframes bounce-in{
		0% {
			height 0px
		}
		100% {
			height 100px
		}
	}
	.time
		margin-top -17px
	.const-content
		max-width 60%
	.circle
		width 45px
		height 45px
		img
			width 100%
			height 100%
	.Imgcontent
		width 100%
		background #3d9bff
		img
			width 100%
			display block
	.mask-center
		position absolute
		top 50%
		left 50%
		transform translate(-50%, -50%)
		img
			width 100%
	.connectValue
		min-height 25px
		padding-top 3px
		max-height 65px
		overflow auto
		-webkit-user-select text
	.btn
		height 30px
		line-height 30px
		padding 0 10px
		border-radius 4px
		font-size 14px !important
	input
		position absolute
		display inline-block
		height 100%
		z-index 10001
		top 0px
		left 0px
		opacity 0
	.w10
		width 100%
	.h10
		height 100%
	.title
		display inline-block
		text-align center
		border-radius 10px
		bottom -5px
		left 3px
		width 40px
	.word
		word-wrap break-word
		word-break break-all
	.sound
		width 100px
		height 30px
		border-radius 20px
		background #3d9bff
		img
			max-height 60%
	.bg-primary
		background-color #3d9bff !important
	.pb45
		padding-bottom 65px
	#content
		padding 30px 0px
</style>
