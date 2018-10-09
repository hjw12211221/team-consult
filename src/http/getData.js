/*
接口
*/
import bookApi from '../configs/bookApi'
/*
医生端
*/
// 咨询列表
export const consultList = (obj) => bookApi('ddyy.adv.consult.list', obj)
// 咨询详情
export const consultInfo = (obj) => bookApi('ddyy.adv.consult.info', obj)
// 咨询列表
export const replyList = (obj) => bookApi('ddyy.adv.consult.reply.list', obj)
// 咨询列表
export const addChart = (obj) => bookApi('ddyy.adv.consult.reply.add', obj)
// 医生个人中心
export const myHome = (obj) => bookApi('ddyy.sys.doc.personal.center', obj)
// 医生个人中心二维码
export const myCode = (obj) => bookApi('ddyy.doc.qrcode.fresh', obj)
// 医生个人中心我的团队
export const myTeam = (obj) => bookApi('ddyy.doc.qrcode.fresh', obj)
// 医生个人中心我的团队列表
export const teamList = (obj) => bookApi('ddys.apiTeamInfoService.team.doc.list', obj)
// 医生个人中心我的团队主页
export const teamHome = (obj) => bookApi('ddys.apiTeamInfoService.team.info', obj)
// 医生个人中心我的团队
export const myInfo = (obj) => bookApi('ddyy.sys.doc.update', obj)
// 医生个人中心图文咨询
export const imgConsult = (obj) => bookApi('ddyy.sys.doc.adv.fee.open', obj)
// 医生个人中心我的收益
export const myIncome = (obj) => bookApi('ddyy.sys.doc.bill.detail', obj)
// 医生个人中心银行卡列表
export const myBank = (obj) => bookApi('ddyy.adv.doc.bank.list', obj)
// 医生个人中心删除银行卡
export const delecBank = (obj) => bookApi('ddyy.adv.doc.bank.delete', obj)
// 医生个人中心提现
export const deposit = (obj) => bookApi('ddyy.doc.bill.extract', obj)
// 医生个人中心手机号验证码
export const phoneCode = (obj) => bookApi('ddyy.book.captcha.generate', obj)
// 医生个人中心银行卡类型
export const bankType = (obj) => bookApi('ddyy.sys.bank.list', obj)
// 医生个人中心银行卡添加
export const addBank = (obj) => bookApi('ddyy.adv.doc.bank.add', obj)
// 医生个人中心修改密码
export const upPwd = (obj) => bookApi('ddyy.sys.doc.password.update', obj)
/*
患者管理端
*/
// 只显示分组
export const group = (obj) => bookApi('ddyy.adv.doc.user.group.list', obj)

// 分组列表(包含分组跟患者)
export const groupList = (obj) => bookApi('ddyy.adv.doc.user.list.group', obj)

// 删除分组
export const groupDelete = (obj) => bookApi('ddyy.adv.doc.user.group.delete', obj)

// 添加分组
export const groupAdd = (obj) => bookApi('ddyy.adv.doc.user.group.add', obj)

// 患者搜索
export const userSearch = (obj) => bookApi('ddyy.adv.doc.user.search', obj)

// 新关注患者
export const listNew = (obj) => bookApi('ddyy.adv.doc.user.list.new', obj)

// 医生主动关注患者
export const followByDoc = (obj) => bookApi('ddyy.adv.doc.user.follow.by.doc', obj)

// 创建群发消息
export const groupCreate = (obj) => bookApi('ddyy.adv.doc.mess.sms.group.create', obj)

// 创建群发消息
export const smsDetail = (obj) => bookApi('ddyy.adv.doc.mess.sms.detail', obj)

// 发送消息
export const smsSend = (obj) => bookApi('ddyy.adv.doc.mess.sms.send', obj)

// 发送消息
export const msgList = (obj) => bookApi('ddyy.adv.doc.mess.sms.list', obj)

// 修改备注
export const modify = (obj) => bookApi('ddyy.adv.doc.user.info.modify', obj)

// 修改分组名
export const changeGroupName = (obj) => bookApi('ddyy.adv.doc.user.group.modify', obj)

// 取消关注
export const cancleByDoc = (obj) => bookApi('ddyy.adv.doc.user.cancel.by.doc', obj)

// 上传图片
export const addImg = (sendData) => bookApi('ddyy.system.file.image.base64.upload', {'base64': sendData}, '2')

// 获取jsdk
export const getConfig = (obj) => bookApi('ddyy.system.wechat.jsapiticket.get', obj, '2')
