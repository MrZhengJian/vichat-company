<template>
      <!-- 高德地图 -->
      <div class="newfenceArea">
        <div class="mapBtns">
          <Button type="primary" @click="drawPolygon">{{$t('drawPolygon')}}</Button>
          <Button type="error" @click="deletePolygon">{{$t('user_table_col_delete')}}</Button>
        </div>
        <el-amap-search-box class="mapSearch" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
        <el-amap
            vid="amap" 
            :zoom="zoom" 
            :amap-manager="amapManager" 
            :center="center" 
            :plugin="plugin"
            ref="amap"
            class="amap-demo"
            >
              <el-amap-polygon 
                ref="polygon" 
                :path="polygon.path" 
                :draggable="polygon.draggable" 
                :editable="polygon.editable" 
                :events="polygon.events"
                :strokeColor="polygon.strokeColor"
                :strokeWeight="polygon.strokeWeight"
                :fillColor="polygon.fillColor"
                :fillOpacity="polygon.fillOpacity"

              ></el-amap-polygon>
            </el-amap-marker>
        </el-amap>
      </div>           
      <!-- 谷歌地图 -->
      <!-- <div class="newfenceArea" v-if="step==1">
        <div class="mapBtns">
          <Button type="primary" @click="gmapDrawPolygon">{{$t('drawPolygon')}}</Button>
          <Button type="error" @click="gmapDeletePolygon">{{$t('user_table_col_delete')}}</Button>
        </div>
        <gmap-map
            ref='gamp'
            :center="mapCenter"
            :zoom="15"
            style="width: 100%; height: 100%"
            >
            <gmap-polygon 
              :paths=gmapPolygon.paths
              :draggable="gmapPolygon.draggable" 
              :editable="gmapPolygon.editable" 
              :events="gmapPolygon.events"
              :strokeColor="gmapPolygon.strokeColor"
              :strokeWeight="gmapPolygon.strokeWeight"
              :fillColor="gmapPolygon.fillColor"
              :fillOpacity="gmapPolygon.fillOpacity"
            ></gmap-polygon>
        </gmap-map>
      </div>            -->
</template>

<script type="ecmascript-6">
import orgTree from '@/view/common-components/org-tree/table-tree'
import { queryFence,createFence } from '@/api/fence'
import { queryRoomMembers, saveRoomMembers, deleteRoomMember, batchDeleteRoomMember, setRoomMemberAdminGrade } from '@/api/channel'
import { batchQueryUsers, queryEdposUsers } from '@/api/user-manage'
import { dateFormat } from '@/libs/tools'
import VueAMap from "vue-amap";   //在页面中引入高德地图
import "../../../styles/common.less";
let amapManager = new VueAMap.AMapManager();
export default {
  components: {
    orgTree
  },
  data () {
    let _this=this;
    return {
      partyId:this.$store.state.user.userObj.partyId,
      step:4,
      finished:true,
      spin: false,
      
      searchMes: {
        fenceName:'',
        fenceType:''
      },

      regcoords:'',
      
      
      zoom: 16,
      // 高德参数
      center: [0,0],
      searchOption: {
        city: '',
        citylimit: false
      },
      plugin: [
        {
          pName:'Geolocation',//定位插件
          showMarker:false,
          events:{
            init(o){
              //定位成功 自动将marker和circle移到定位点
              o.getCurrentPosition((status, result) => {
                _this.center=[result.position.lng,result.position.lat]
              });
            }
          }
        }
      ],
      amapManager: amapManager,
      polygon:{
        draggable: true,
        editable: true,
        // path: [[121.5273285, 31.21915044], [121.5273285, 31.21515044], [121.5293285, 31.21515044] ,[121.5293285, 31.21915044]],
        path: [],
        strokeColor:'#2b85e4',
        strokeWeight:2,
        fillColor:'#2db7f5',
        fillOpacity:0.5,
        events: {
          // adjust: () => {
          //   _this.fenceMes.regcoords=this.$refs.polygon.$$getPath()
          // },

        }
      },
     
  

      fenceName_placeholder:this.$t('fenceName_placeholder'),
      fenceName_placeholder1:this.$t('fenceName_placeholder1'),
      fenceName_placeholder2:this.$t('fenceName_placeholder2'),
      fenceType_placeholder:this.$t('fenceType_placeholder'),
      newFence:this.$t('newFence'),
      newfenceName:this.$t('newfenceName'),
      newfenceArea:this.$t('newfenceArea'),
      newfenceRules:this.$t('newfenceRules'),
      newfenceUser:this.$t('newfenceUser'),
      newfenceFinish:this.$t('newfenceFinish'),
      week:this.$t('week'),
      month:this.$t('month'),
      everyday:this.$t('everyday'),
      SelectTime:this.$t('select_time'),
    }
  },

  created: function () {
    // this.geolocate()
  },
  methods: {
    
    // 高德
    onSearchResult(pois) {
      let latSum = 0;
      let lngSum = 0;
      if (pois.length > 0) {
        pois.forEach(poi => {
          let {lng, lat} = poi;
          lngSum += lng;
          latSum += lat;
          // this.markers.push([poi.lng, poi.lat]);
        });
        let center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        };
        this.center = [center.lng, center.lat];
      }
    },
    drawPolygon(){
        let center = this.$refs.amap.$$getCenter()
        if(this.polygon.path.length==0){
          this.polygon.path=[
              [center[0]-0.001,center[1]+0.001],
              [center[0]+0.001,center[1]+0.001],
              [center[0]+0.001,center[1]-0.001],
              [center[0]-0.001,center[1]-0.001]
            ]
        }
    },
    deletePolygon(){
      this.polygon.path=[]
    },
    sendRegcoords(){
      this.$emit('getRegcoords',this.$refs.polygon.$$getPath())
    },
   

  },
  computed: {
    channel_details_modal1_selectOrg_placeholder: function () {
      return this.$t('channel_details_modal1_selectOrg_placeholder')
    },
  },
  mounted: function () {
    window.document.title = localStorage.getItem('platformNameLong')
  }

}
</script>

<style rel="stylesheet" lang="less">
   .newfenceArea{
			position: relative;
			.mapSearch{
				position: absolute;
				top: 10px;left: 10px;
			}
			.mapBtns{
				position: absolute;
				top: 10px;right: 10px;
				z-index: 100;
				.ivu-btn{
					margin-left: 15px;
				}
			}
		}
</style>