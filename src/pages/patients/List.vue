<template>
  <div class="cl-checklist">
    <div class="checklist" v-if='showIndex === 0'>
      <div class="desc">您已选中 <span>{{checkboxValue.length}}</span> 个，最多可选<span>{{max}}</span>个</div>
      <div class="list px3" ref="list">
        <div class="line border-1px checkbox-left"
             v-for="(item, index) in dataList"
             :key="index"
             :class="{'selected':item.isChecked, 'disabled':item.isDisabled}"
             @click="selectedItem(item)">
          <div class="l">
            <img src="../../images/defalu.png" alt="" class="pr3">
              <span class="pr1 pt1">{{item.label}}</span>
              <span class="pt1" v-if='item.remark'>( {{item.remark}} )</span>
          </div>
          <div class="r"></div>
        </div>
      </div>
      <div class="list fixed w10 bottom0 handle-border-top px3 bg-white">
        <div class="line  checkbox-left" :class='{"selected": selectAll}'  @click='all'>
          <div class="l">
              <span class="pr1 pt1">全选</span>
          </div>
          <div class="r"></div>
          <div class="absolute next-click" @click.stop="onConfirm">下一步</div>
        </div>
      </div>
    </div>
		<div class="checklist" v-if='showIndex === 1'>
				<div class="patient-list list px3">
					<div class="item f16" v-for='(x, index) in dataList' :key='index'>
								<div class="line checkbox-left border-1px patient-item" :class="{'selected':gropuCheckboxValue[index].first}">
									<div class="l">
										<div class="p3">
											<icon-svg class="c9" iconClass='arrow-right' v-if='showItem !== index'/>
											<icon-svg class="c9" iconClass='jiantou-copy-copy' v-if='showItem === index'/>
											<span class="p12" @click='changeItem(index)'>{{x.groupName}}	( {{x.duVoList.length}} )</span>
										</div>
									</div>
									<div class="r" @click="selectedItem(x, index)"></div>
								</div>
								<ul class="w10 item-group">
									<li class="p3" v-for='(j ,i) in x.duVoList' @click='changeTow(index, i)' :class='{"handle-border-bottom": i === x.duVoList.length-1}' :key='i'>
										<div class="line checkbox-left border-1px" :class="{'selected':gropuCheckboxValue[index].two[i]}">
											<div class="l">
												<img src="../../images/defalu.png" alt="" class="circel pr2">
												<span class="pr3">{{j.userName}}</span>
												<span v-if='j.remark'> (	{{j.remark}}	)</span>
											</div>
											<div class="r"></div>
										</div>
									</li>
								</ul>
					</div>
			</div>
			<div class="list fixed w10 bottom0 handle-border-top px3 bg-white">
				<div class="line  checkbox-left" :class='{"selected": selectAll}'  @click='selectAllGroup'>
					<div class="l">
							<span class="pr1 pt1">全选</span>
					</div>
					<div class="r"></div>
					<div class="absolute next-click" @click.stop="onConfirm">下一步</div>
				</div>
		</div>
    </div>
  </div>
</template>

<script>
import { dom } from '@/configs/common'
export default {
	props: {
		max: {
			type: Number,
			default: 0
		},
		showIndex: {
			type: Number,
			default: 0
		},
		dataList: {
			type: Array,
			require: true
		},
		checkboxLeft: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			checkboxValue: [],	//	全部
			selectAll: false,
			showItem: '',
			gropuCheckboxValue: []	//	分组
		}
	},
	mounted () {
	},
	methods: {
		selectedItem (item, index) {
			if (this.showIndex === 0) {
				if (!item.isDisabled) {
					item.isChecked = !item.isChecked
					this.checkboxValue = this.dataList.filter((item) => {
						return item.isChecked
					})
					if (this.dataList.length === this.checkboxValue.length) {
						this.selectAll = true
					} else {
						this.selectAll = false
					}
					if (this.checkboxValue.length === this.max) {
						this.dataList.map((item) => {
							if (!item.isChecked) {
								item.isDisabled = true
							}
						})
					} else {
						this.dataList.map((item) => {
							item.isDisabled = false
						})
					}
				}
			} else if (this.showIndex === 1) {
				this.gropuCheckboxValue[index].first = !this.gropuCheckboxValue[index].first
				this.gropuCheckboxValue[index].two.map((item, i) => {
					this.gropuCheckboxValue[index].first ? this.gropuCheckboxValue[index].two[i] = true : this.gropuCheckboxValue[index].two[i] = false
				})
				this._getSelectLen()
				this.gropuCheckboxValue = [...this.gropuCheckboxValue]
			}
		},
		changeTow (index, i) {	//	改变分组里面的 子分组
			this.gropuCheckboxValue[index].two[i] = !this.gropuCheckboxValue[index].two[i]
			let isALlSelect = false
			this.gropuCheckboxValue[index].two.map((item) => {	//	如果全部被选中了
				item ? isALlSelect = true : isALlSelect = false
			})
			isALlSelect ? this.gropuCheckboxValue[index].first = true : this.gropuCheckboxValue[index].first = false
			this._getSelectLen()
			this.gropuCheckboxValue = [...this.gropuCheckboxValue]
		},
		_getSelectLen () {
			var gropulen = 0	//	被选中的个数
			var listLen = 0	//	总共多少个
			this.gropuCheckboxValue.map((item) => {
				item.two.map((val) => {
					val ? gropulen++ : ''
				})
			})
			this.dataList.map((item) => {
				item.duVoList.map((val) => {
					listLen++
				})
			})
			gropulen === listLen ? this.selectAll = true : this.selectAll = false	//	如果被选中的个数等于总数
		},
		onConfirm () {
			let arr = []
			if (this.showIndex === 0) {
				arr = this.dataList.filter((item) => {
					return item.isChecked
				})
			} else if (this.showIndex === 1) {
				this.gropuCheckboxValue.map((item, index) => {
					item.two.map((val, i) => {
						val ? arr.push(this.dataList[index].duVoList[i]) : ''
					})
				})
			}
			this.$emit('on-confirm', arr)
		},
		all () {	//	全选
			if (this.dataList.length === this.checkboxValue.length) {	//	如果已经被全选
				this.selectAll = false
				this.dataList.map((item, index) => {
					if (index < 100) {
						item.isChecked = false
						this.checkboxValue = []
					}
				})
			} else {
				this.selectAll = true
				this.checkboxValue = []
				this.dataList.map((item, index) => {
					if (index < 100) {
						item.isChecked = true
						this.checkboxValue.push(true)
					}
				})
			}
		},
		selectAllGroup () {	//	分组里面的全选
			this.selectAll = !this.selectAll
			var len = 0
			this.gropuCheckboxValue.map((item) => {
				item.two.map(val => {
					val === true ? len++ : ''
				})
			})
			if (len > 0) {
				this.gropuCheckboxValue.map((item) => {
					item.first = false
					item.two.map((val, index) => {
						item.two[index] = false
					})
				})
			} else {
				this.gropuCheckboxValue.map((item) => {
					item.first = true
					item.two.map((val, index) => {
						item.two[index] = true
					})
				})
			}
			// this.gropuCheckboxValue = [...this.gropuCheckboxValue]
		},
		changeItem (index) { //  点击分组的时候
			let ulDom = dom('item-group')[index]
			if (ulDom.style.display === 'block') {
				ulDom.style.display = 'none'
			} else {
				ulDom.style.display = 'block'
			}
		}
	},
	watch: {
		'showIndex' (val) {
			if (val === 0) {	//	全部
				this.checkboxValue = []
				this.selectAll = false
				this.dataList.map((item) => {
					item.isChecked = false
				})
			} else if (val === 1) {	//	分组
				this.gropuCheckboxValue = []
				this.checkboxValue = []
				this.selectAll = false
				this.dataList.map((item, index) => {	//	按照分组添加对应的数据
					this.gropuCheckboxValue.push({first: false, two: []})
					item.duVoList.map((val) => {
						this.gropuCheckboxValue[index].two.push(false)
					})
				})
			}
		}
	}
}
</script>

<style scoped>
  .checklist{
    width: 100%;
    background-color: #fff;
		padding-bottom: 50px;
  }
  .checklist-overlay{
    z-index: 1000;
    background: rgba(0, 0, 0, .5);
    transition: all .5s;
  }
  .topbar{
    display: -webkit-flex;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 45px;
    font-size: 16px;
    padding: 0 13px;
    border-bottom: 1px solid rgb(217,217,217);
  }
  .topbar .cancel{
    color: rgb(159,159,159);
  }
  .topbar .confirm{
    color: rgb(46,166,242);
  }
  .desc{
    height: 30px;
    line-height: 30px;
    padding-right: 10px;
    font-size: 14px;
    text-align: right;
    color: rgb(159,159,159);
    display: none;
  }
  .desc span{color: rgb(46,166,242);}
  .list .line {
    display: -webkit-flex;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
  }
  .list .line.checkbox-left{
    flex-direction: row-reverse;
  }
  .list .line .l{
    display: -webkit-flex;
    display: flex;
    align-items: flex-start;
    width: 90%;
  }
  .list .line .l .address{
    color: rgb(159,159,159);
    position: relative;
    padding-left: 15px;
  }
  .list .line .l .address::before{
    content: ' ';
    display: inline-block;
    position: absolute;
    width: 15px;
    height: 15px;
    top: 2px;
    left: 0;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAbCAYAAAB836/YAAABu0lEQVRIiaXUzU8TQRjH8U9fpAkXIZqItHghxEgietuD/gP84R420QSDcCDxIq6KaCoJYCuaeJhdu93OlILfpEnnmWd++7zMM63d3V0RuljHQ9xFr7SP8QNfUOBPlmUzB5tsYBtLkb0eHpS/JzjEcd2hs7W1Vf1v4TkeoxMLu0EHa0VRLBdFcTIYDEC75vCsjO6mbGCnWlSCg1uKVTzK83xAqGFHqFmMX3iP7+X6HjbF67ud5/nnLvomXaxziVcY1WxDfMQLLDf8e+i3sZaIbq8hVjHC28SZtTZWIhs/TdKM8S3xsZW2eLrjOWIVMcFeO2Ik1Kc1R6xltoYI1+Y8Yl8Sxi7Funinz9s4SRzaEa/vKp4mzpx0hSHfjGzewUt8EpoA98voUuUoujgT7tdqxKEl3NN+QqDOMMuys6opRwscuI4jJrP8VYjytgxLjanX5uA/BA+qh7YuOBQadFOKLMv+Zde82Ae4uoHYlUZmTcGx8KwvymGWZVNjGhu9DzhdQOy09J0iNct75qd+VfrMkBIcYX+O4L74a5MUJHT8OGI/Nuc2zBOEd7iorS9KW5LrBH/jjZDeCK9LW5K/QatiGcsSFOsAAAAASUVORK5CYII=");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: 0;
  }
  .list .line .r{
    width: 20px;
    height: 20px;
    margin: 0 5px;
    -webkit-border-radius: 50%;
    border-radius: 50%;
    border:1px solid #9e9e9e;
    background-color: #fff;
    position: relative;
    z-index: 0;
  }
  .list .line.selected .l .title{
    color: #1799fa;
  }
  .list .line.selected .r{
    border: 1px solid #1799fa;
    background-color: #1799fa;
  }
  .list .line.selected .r::before{
    content: ' ';
    position: absolute;
    top: 4px;
    left: 4px;
    width: 12px;
    height: 12px;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAPCAYAAAALWoRrAAAA90lEQVQ4ja3TMSuFURgH8GeQRGIwy6BkUbIYlHwBu0Umi8VkMVlMJoMvIcNdDAYlJuULWCSESBSLwc9we/P2eu715t6nznKe//Or0zknEF1YS3jAHRa7Aa7iy0/ddAquVUC47ARcT8APLPwX3PC73jGPCPRiGSvoqwFuJuAb5opMoFFqnmCwDbiVgK+YLecCn5XQGYYScDsBXzBTzQb2k/A5hkvBnSTzhOnsRIEBHCdDFxjBbtJ7xFQGFmigH0fJ8HOyd4/JVmAZDc2bP0yQct1ioh1YRYvn1cg0XGP8LzBDC/igAl5hrA7YCg30YE/zl5xitC6I+AYJmBaJbbKurAAAAABJRU5ErkJggg==");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;
    z-index: 1;
  }
  .list .line.disabled .l .title{
    color: #9e9e9e;
  }
  .list .line.disabled .r{
    border: 1px solid #9e9e9e;
    background-color: #9e9e9e;
  }

  .border-1px{
    position: relative;
  }
  .border-1px::after{
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-bottom: 1px solid rgb(217,217,217);
    content: ' ';
  }
  @media (-webkit-min-device-pixel-ratio: 1.5), (min-device-pixel-ratio: 1.5) {
    .border-1px::after {
      -webkit-transform: scaleY(0.7);
      transform: scaleY(0.7);
    }
  }
  @media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2) {
    .border-1px::after {
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
  }
img{
	width:25px;
	vertical-align:sub;
}
.next-click{
  right: 0;
  width: 125px;
  background: #3d9bff;
  text-align: center;
  color: #fff;
  height: 50px;
  line-height: 50px;
}
.item-group{
	display: none;
}
</style>
