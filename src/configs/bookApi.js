/**
 * Created by Administrator on 2016/11/1.
 */
import Vue from 'vue'
import axios from 'axios'
import config from './config.js'
const HOST = config.HOST
const baseApi = config.baseApi
const basePostData = config.basePostData
const bookApi = (service, postData, type) => {
	/* else if(type=='ddhyTest'){
    return axios.post('https://ddys-book.diandianys.com/app', {service:service, ...basePostData, ...postData })
    // 点点好医 授权 sdk 正式  book 接口测试   以上状态下专用
  } */
	if (type === '2') {
		return axios.post(baseApi, {
			'service': service, ...basePostData, ...postData})
	} else {
		return axios.post(HOST, {
			service: service, ...basePostData, ...postData }).then((res) => {
			if (res.status === 200) {
				return res
			}
		})
	}
}
export default bookApi
