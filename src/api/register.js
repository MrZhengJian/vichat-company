/* eslint-disable */
import axios from '@/libs/api.request'

export const registerCompany = (params) => {
	console.log(params)
  return axios.request({
    url: '/vc/registerCompany',
    method: 'post',
    params
  })
}