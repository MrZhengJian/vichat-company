import axios from 'axios'
import router from '../router'
import {Message} from 'iview'
import i18n from '@/locale'
// import { Spin } from 'iview'
class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }
  distroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    // instance.interceptors.request.use(config => {
    //   // 添加全局的loading...
    //   if (!Object.keys(this.queue).length) {
    //     // Spin.show() // 不建议开启，因为界面不友好
    //   }
    //   this.queue[url] = true
    //   return config
    // }, error => {
    //   return Promise.reject(error)
    // })
    // 响应拦截

    instance.interceptors.response.use(res => {
      // this.distroy(url)
      if (res.data.code && res.data.code == -1) {
        router.push({
          name: 'login'
        })
      } else if (res.data.code && res.data.code != 0 && res.data.i18nCode!='') {
        let i18nCode = '' + res.data.i18nCode
        Message.error(i18n.t(i18nCode))
        return res
      } else if (res.data.code && res.data.code != 0 && res.data.i18nCode=='' && res.data.msg && res.data.msg!="") {
        Message.error(res.data.msg)
        return res
      } else if (res.data.code && res.data.code != 0 && res.data.i18nCode=='' && res.data.msg && res.data.msg=="") {
        Message.error(i18n.t('unknown_error'))
        return res
      } else {
        const { data, status } = res
        return { data, status }
      }
    }, error => {
      this.distroy(url)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
