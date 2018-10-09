// 获取dom
export const dom = (el) => document.getElementsByClassName(el)

// 关闭遮罩层
export const closeDom = (el, val) => {
	if (el.target.className.includes(val)) {
		return true
	} else {
		return false
	}
}
export const trim = (str) => {
	return str.replace(/(^\s*)|(\s*$)/g, '')
}
// 上传图片
export const getImgBase = async (ele, request, success, that) => {
	var fileInput = ele.target
	var fileType = fileInput.files[0].type
	if (fileInput.files.length == 0) {
		return false
	}
	if (fileInput.files.length > 1) {
		that.$setHint({'val': '不支持多个图片上传'})
		return false
	}
	// var data = new	FormData()
	// data.append('fileName', fileInput.files[0].name)
	var reader = new FileReader()	//	读取图片的base
	if (typeof reader === 'undefined') { // 查看浏览器是否支持FileReader
		alert('您的浏览器不支持图片上传，请升级您的浏览器')
		return false
	}
	var file = ele.target.files[0]
	var base64head = ''
	reader.readAsDataURL(file)	//	传递图片的属性
	reader.onloadend = function (e) {	//	图片加载完成
		base64head = reader.result	//	获取图片的base64
		var image = new Image()
		image.src = base64head
		image.onload = async function () {	//	创建一个image对象，给canvas绘制使用
			var canvas = document.createElement('canvas')
			// 最大尺寸限制，可通过国设置宽高来实现图片压缩程度
			var maxSize = 1000
			var width = image.naturalWidth
			var height = image.naturalHeight
			var imgRatio = width / height
			if (imgRatio >= 1 && width > maxSize) {
				width = maxSize
				height = width / imgRatio
			} else if (imgRatio < 1 && height > maxSize) {
				height = maxSize
				width = height * imgRatio
			}
			canvas.width = width
			canvas.height = height
			var context = canvas.getContext('2d')
			context.drawImage(this, 0, 0, width, height)
			var quality = width >= 1500 ? 0.5 : width > 600 ? 0.6 : 1
			var newImageData = canvas.toDataURL(fileType, quality)	//	重新生成图片，<span style="font-family: Arial, Helvetica, sans-serif;">fileType为用户选择的图片类型</span>
			var sendData = newImageData.replace('data:' + fileType + ';base64,', '')
			const results = await request(sendData)
			that.requestResult = results	// 将值付给调用这个方法组件里面的值,再执行传过来的回调方法
			success()
		}
	}
}
// 预览图片
export const readImgs = (currenImg, imgList) => {
	event && event.preventDefault()
	wx.previewImage({
		current: currenImg, // 当前显示图片的http链接
		urls: imgList // 需要预览的图片http链接列表
	})
}
export const WecharImg = (success, that) => {
	// console.log(wx)
	var URL = window.location.href
	that.$api('ddyy.system.wechat.jsapiticket.get', {
		appid: that.$util.wxid,
		reqUrl: URL
	}, '2').then((res) => {
		// alert(1)
		var config = res.data.obj
		wx.config(config)
		wx.ready(() => {
			wx.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					var upLoad = () => {
						wx.uploadImage({
							localId: res.localIds[0],
							success: (res) => {
								var serverId = res.serverId
								that.$api('ddyy.system.file.upload.wechat.media', {
									appid: that.$util.wxid,
									mediaId: serverId
								}, '2').then((res) => {
									success(res.data.obj)
								})
							}
						})
					}
					upLoad()
				}
			})
		})
	})
}