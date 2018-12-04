<template>
  <div class="header-bar">
    <!-- <sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollpasedChange"></sider-trigger> -->
    <custom-bread-crumb show-icon style="margin-left: 5px;" :list="breadCrumbList"></custom-bread-crumb>
    <div class="custom-content-con">
      <slot></slot>
    </div>
    <!-- <div v-if="isRoleMap=='true'" class="map-btn-con">
      <a v-if="gpsType=='amap'||gpsType=='all'" href="/map/amap.html" target="_blank" style="color:#2D8CF0">
           <Icon type="ios-navigate" style="font-size:15px;"></Icon>
           {{$t("amap")}}
      </a>
      <a v-if="gpsType=='google'||gpsType=='all'" href="/map/googleMap.html" target="_blank" style="color:#2D8CF0">
           <Icon type="ios-navigate" style="font-size:15px;"></Icon>
           {{$t("gmap")}}
      </a>
    </div> -->
  </div>
</template>
<script>
// import siderTrigger from './sider-trigger'
import customBreadCrumb from './custom-bread-crumb'
import './header-bar.less'
export default {
  name: 'HeaderBar',
  components: {
    customBreadCrumb
  },
  props: {
    collapsed: Boolean
  },
  computed: {
    breadCrumbList () {
      return this.$store.state.app.breadCrumbList
    }
  },
  data(){
    return {
      isSupportMap:localStorage.getItem('isSupportMap'),
      isRoleMap:localStorage.getItem('isRoleMap'),
      gpsType:localStorage.getItem('gpsType'),
    }
  },
  methods: {
    
  },

}
</script>
