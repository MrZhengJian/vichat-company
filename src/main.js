// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
// import * as VueGoogleMaps from 'vue2-google-maps'
import 'iview/dist/styles/iview.css'
import './index.less'
import '@/assets/icons/iconfont.css'
// import '@/mock'
// 实际打包时应该不引入mock


Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)

function isBrowser() {
    var userAgent = navigator.userAgent;
    //微信内置浏览器
    if(userAgent.match(/MicroMessenger/i) == 'MicroMessenger') {
        return "MicroMessenger";
    }
    //QQ内置浏览器
    else if(userAgent.match(/QQ/i) == 'QQ') {
        return "QQ";
    }
    //Chrome
    else if(userAgent.match(/Chrome/i) == 'Chrome') {
        return "Chrome";
    }
    //Opera
    else if(userAgent.match(/Opera/i) == 'Opera') {
        return "Opera";
    }
    //Firefox
    else if(userAgent.match(/Firefox/i) == 'Firefox') {
        return "Firefox";
    }
    //Safari
    else if(userAgent.match(/Safari/i) == 'Safari') {
        return "Safari";
    }
    //IE
    else if(!!window.ActiveXObject || "ActiveXObject" in window) {
        return "IE";
    }
    else {
        return "未定义:"+userAgent;
    }
}
/* eslint-disable no-new */
console.log(isBrowser())
if(isBrowser() =='IE'){
	alert(i18n.t('IE_alert'));
}else{
	new Vue({
	  el: '#app',
	  router,
	  i18n,
	  store,
	  render: h => h(App)
	})
}




