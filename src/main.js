// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import VueAMap from 'vue-amap';
import * as VueGoogleMaps from 'vue2-google-maps';
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
// import * as VueGoogleMaps from 'vue2-google-maps'
import 'iview/dist/styles/iview.css'
import './index.less'
import '@/assets/icons/iconfont.css'
// import '@/mock'
// 实际打包时应该不引入mock

// 引入vue-amap

Vue.use(VueAMap);
 
// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: '9e7f19d56c6fb77066ce29fcf7641d08',
  // 插件集合
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor','AMap.Geolocation'],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4'
});


Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyB5DfBgoFxu_8MPchRt79ehKzo8ocG-HIA',
    v: '0.10.2',
    libraries: 'places'
  }
})

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




