<template>
    <div class="new_fence">
        <div class="steps" style="padding-left:10%;margin:10px 0;">
          <Steps :current="step" size="small">
            <Step :title="newfenceName"></Step>
            <Step :title="newfenceArea"></Step>
            <Step :title="newfenceRules"></Step>
            <Step :title="newfenceUser"></Step>
            <Step :title="newfenceFinish"></Step>
          </Steps>
        </div>
        <Divider />
        <div class="content">
          <div class="newfenceName" v-if="step==0">
            <div class="nameContent">
              <p>
                <span>{{this.$t('name')}}：</span>
                <Input clearable v-model="fenceMes.fenceName" :max="100" :placeholder="fenceName_placeholder1" style="width:400px;"></Input>
              </p>
              <p>
                <span>{{this.$t('desc')}}：</span>
                <Input type='textarea' :autosize="{'minRows': 3,'maxRows': 5}" clearable v-model="fenceMes.fenceDesc" :max="100" :placeholder="fenceName_placeholder2" style="width:400px;"></Input>
              </p>
            </div>
          </div>    
          <!-- 高德地图 -->
          <div class="newfenceArea" v-if="step==1">
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
          <!-- rules -->
          <div class="newfenceRules" v-if="step==2">
            <div class="ruleContent">
              <div class="time_rule">
                  <div class="time_rule_left">
                      <p>
                          <span>{{this.$t('rule')}}：</span>
                          <Select v-model="fenceMes.fenceType" style="width:300px">
                              <Option :value="1" :key="1">{{ $t('No_entry') }}</Option>
                              <Option :value="2" :key="2">{{ $t('Prohibit_going_out') }}</Option>
                          </Select>
                      </p>
                      <p>
                          <span>{{this.$t('time')}}：</span>
                          <TimePicker v-model="timeRule.time" @on-ok="addTime" confirm format="HH:mm" type="timerange" placement="bottom-start" placeholder="Select time" style="width: 300px"></TimePicker>
                      </p>
                      <div class="timeResult">
                          <div class="item" v-for="(item,index) in timeRule.times">
                              <span>{{item[0]}} - {{item[1]}}</span>
                              <Icon @click="deleteTimeItem(index)" type="md-close" />
                          </div>
                      </div>
                      <p>
                        <span>{{this.$t('home_echart_date')}}：</span>

                        <RadioGroup v-model="timeRule.type">
                            <Radio :label="3">{{$t('everyday')}}</Radio>
                            <Radio :label="1">{{$t('week')}}</Radio>
                            <Radio :label="2">{{$t('month')}}</Radio>
                        </RadioGroup>
                      </p>
                      <div class="typeResult">
                          <div v-if="timeRule.type==1" class="weekItem">
                              <span v-for="(item,index) in weekList" v-bind:class="{'active':!item}"  @click='clickItem(weekList,index)'>{{$t('week'+(index+1))}}</span>
                          </div>
                          <div v-if="timeRule.type==2" class="weekItem" style="">
                              <span v-for="(item,index) in monthList" v-bind:class="{'active':!item}"  @click='clickItem(monthList,index)' style="padding:0;width: 38px;height: 32px;text-align: center;line-height: 32px;">{{index+1}}</span>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
          </div>     
           <!-- user -->
          <div class="newfenceUser" v-if="step==3">
            
          </div>           
        </div>
        <div class="footer">
            <Button type="default" v-if="step!=0" @click="changeStep(-1)">{{$t('prev')}}</Button>
            <Button type="primary" v-if="step!=4" @click="changeStep(1)">{{$t('next')}}</Button>
            <Button type="primary" v-if="step==4" @click="modal1=false">{{$t('finish')}}</Button>
        </div>
      </div>
      
</template>

<script type="ecmascript-6">
import orgTree from '@/view/common-components/org-tree/table-tree'
import { queryFence } from '@/api/fence'
import { queryRoomMembers, saveRoomMembers, deleteRoomMember, batchDeleteRoomMember, setRoomMemberAdminGrade } from '@/api/channel'
import { batchQueryUsers, queryEdposUsers } from '@/api/user-manage'
import { dateFormat } from '@/libs/tools'
import VueAMap from "vue-amap";   //在页面中引入高德地图
let amapManager = new VueAMap.AMapManager();
export default {
  components: {
    orgTree
  },
  data () {
    let _this=this;
    return {
      spin: false,
      columns: [
        {
          title: this.$t('name'),
          key: 'fenceNam',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.fenceNam,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.fenceNam)
            ])
          }
        },
        {
          title: this.$t('desc'),
          key: 'fenceDesc',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.fenceDesc,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.fenceDesc)
            ])
          }
        },
        {
          title: this.$t('alarmType'),
          key: 'fenceType',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.fenceType,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.fenceType)
            ])
          }
        },
        {
          title: this.$t('coordinate'),
          key: 'regcoords',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.regcoords,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.regcoords)
            ])
          }
        }

      ],
      tableData: [],

      searchMes: {
        fenceName:'',
        fenceType:''
      },
      fenceMes:{
        fenceName:'',
        fenceDesc:'',
        fenceType:1,
        regcoords:''
      },
      pages: {
        page: 1,
        rows: 10,
        total: 0
      },
      modal1:false,
      step:3,
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
          adjust: () => {
            this.fenceMes.regcoords=this.$refs.polygon.$$getPath()
            // console.log(this.$refs.polygon.$$getPath())
          },
          // rightclick:()=>{
          //   this.polygon.path=[]
          // }
        }
      },
      // 谷歌参数
      mapCenter:{lng: 121.478341,lat:31.239704 },
      gmapPolygon:{
        draggable: true,
        editable: true,
        paths:[
          {lat: 31.21915044, lng: 121.5273285},
          {lat: 31.21515044, lng: 121.5273285},
          {lat: 31.21515044, lng: 121.5293285},
          {lat: 31.21915044, lng: 121.5293285}
        ],
        strokeColor:'#2b85e4',
        strokeWeight:2,
        fillColor:'#2db7f5',
        fillOpacity:0.5,
      },
      
      // [[121.5273285, 31.21915044], [121.5273285, 31.21515044], [121.5293285, 31.21515044] ,[121.5293285, 31.21915044]],

      map_ok:false,

      // rule
      tab:1,
      timeRule:{
        time:['00:00','23:590'],
        times:[],
        type:3
      },
      weekList:[true,true,true,true,true,true,true],
      monthList:[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],

      // user
      showTree: false,
      orgName: '',
      orgId: '',
      searchParams: {
        displayState: 99,
        orgId: 0,
        userName: '',
        page: 1,
        rows: 10
      },
      // 穿梭框数据
      showTree: false,
      orgName: '',
      orgId: '',

      unadded: [],
      added: [],
      listStyle: {
        width: '330px',
        height: '380px'
      },
      transferTitle: [
        this.$t('channel_details_modal1_transfer_title1'),
        this.$t('channel_details_modal1_transfer_title2')
      ],
      transferOperations: [
        this.$t('channel_details_modal1_transfer_operations1'),
        this.$t('channel_details_modal1_transfer_operations2')
      ],
      refreshDisabled: false,

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
    }
  },

  created: function () {
    this.queryFence()
    this.geolocate()
  },
  methods: {
    queryFence(){
      let _this = this
      let param = {
        page:this.pages.page,
        rows:this.pages.rows
      }
      let data ={
        fenceName:this.searchMes.fenceName,
        fenceType:this.searchMes.fenceType
      }
      queryFence(param,data)
      .then(res=>{
        if(res.data.code==0){

        }
      })
    },
    search () {
      this.$refs.pages.currentPage = 1
      this.pages.page = 1
      this.queryFence()
    },
    clear(){
      if(this.searchMes.fenceName==0){
        this.queryFence()
      }
    },
    changePage (current) {
      this.pages.page = current
      this.queryFence()
    },
    changePageSize (current) {
      this.pages.rows = current
      this.queryFence()
    },

    openAddFence(){
      this.step = 0
      this.fenceMes={
        fenceName:'',
        fenceDesc:'',
        fenceType:'',
        regcoords:''
      },
      this.polygon.path=[],
      this.modal1=true
    },
    changeStep(n){
      // if(this.step==0){
      //   if(this.fenceMes.fenceName==''){
      //     this.$Message.error(this.$t('fenceName_placeholder1'))
      //     return
      //   }
      //   if(this.fenceMes.fenceDesc==''){
      //     this.$Message.error(this.$t('fenceName_placeholder2'))
      //     return
      //   }
      // }

      // if(this.step==1){
      //   if(this.fenceMes.regcoords==''&&this.polygon.path.length==0){
      //     this.$Message.error(this.$t('fenceArea_placeholder'))
      //     return
      //   }
      // }

      this.step+=n
    },
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
          this.polygon.path=[[center[0]-0.001,center[1]+0.001],[center[0]+0.001,center[1]+0.001],[center[0]+0.001,center[1]-0.001],[center[0]-0.001,center[1]-0.001]]
        }
        
    },
    deletePolygon(){
      this.polygon.path=[]
    },
    // 谷歌
    gmapSearchResult(){

    },
    gmapDrawPolygon(){
        // console.log(this.$refs.gamp)
    },
    gmapDeletePolygon(){
    },
    geolocate() {
      navigator.geolocation.getCurrentPosition(position => {
        this.mapCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    },
    // 规则
    ruleTabClick(n){
      this.tab = n
    },
    addTime(){
      this.timeRule.times.push(this.timeRule.time)
    },
    deleteTimeItem(index){
      this.timeRule.times.splice(index,1)
    },
    clickItem(arr,n){
      arr.splice(n,1,!arr[n])
    },
    // user
   
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
    @import "../../../styles/common.less";
    @import './new-fence.less';
</style>
