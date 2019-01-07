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
                          <span>{{this.$t('condition')}}：</span>
                          <Select v-model="fenceMes.condition" style="width:300px">
                              <Option :value="1" :key="1">{{ $t('condition1') }}</Option>
                              <Option :value="2" :key="2">{{ $t('condition2') }}</Option>
                          </Select>
                      </p>
                      <p>
                          <span>{{this.$t('alarmLevel')}}：</span>
                          <Select v-model="fenceMes.alarmLevel" style="width:300px">
                              <Option :value="1" :key="1">{{ $t('alarmLevel1') }}</Option>
                              <Option :value="2" :key="2">{{ $t('alarmLevel2') }}</Option>
                          </Select>
                      </p>
                      <p>
                          <span>{{this.$t('time')}}：</span>
                          <TimePicker v-model="timeRule.time" @on-ok="addTime" confirm format="HH:mm" type="timerange" placement="bottom-start" :placeholder="SelectTime" style="width: 300px"></TimePicker>
                      </p>
                      <div class="timeResult">
                          <div class="item" v-for="(item,index) in timeRule.times">
                              <span>{{item[0]+' - '+item[1]}}</span>
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
            <Button type="primary" :disabled="refreshDisabled" @click="refresh" class="refresh">
                {{$t('channel_details_modal1_refresh')}}
            </Button>
            <div class="tree">
                <div class='selectOrg' >
                    <span class="selectOrg-title">
                        {{$t('channel_details_modal1_selectOrg_label')}}
                    </span>
                    <div class="selectOrg-content">
                        <Input type="text" :readonly="true" :placeholder="channel_details_modal1_selectOrg_placeholder" @on-focus="showTree=true" v-model="orgName" style="width:300px;" ></Input>
                    </div>
                    
                </div>
                <org-tree v-show="showTree" v-on:changeOrg="changeOrg"></org-tree>
                
            </div>

            <div class="transfer" ref='transfer'>
                <Transfer
                    :data="unadded"
                    :target-keys="added"
                    :listStyle="listStyle"
                    :titles="transferTitle"
                    filterable
                    :filter-method="filterMethod"
                    :operations="transferOperations"
                    @on-change="_onChange"
                    @on-selected-change="onSelectedChange"
                >
                </Transfer>
            </div>
          </div> 
           <!-- finish -->    
          <div class="newfenceFinish" v-if="step==4">
              <div class="creating" v-if="!finished">
                <h1>{{$t('newfenceCreating')}}...</h1>
              </div>
              <div class="completed" v-if="finished">
                <h1>{{$t('newfenceCompleted')}}</h1>
              </div>
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
import { queryFence,createFence } from '@/api/fence'
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
      partyId:this.$store.state.user.userObj.partyId,
      step:0,
      finished:false,
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
        regcoords:'',
        condition:1,
        alarmLevel:1
      },
      pages: {
        page: 1,
        rows: 10,
        total: 0
      },
      modal1:false,
      
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
          },
          // rightclick:()=>{
          //   this.polygon.path=[]
          // }
        }
      },
      // 谷歌参数
      // mapCenter:{lng: 121.478341,lat:31.239704 },
      // gmapPolygon:{
      //   draggable: true,
      //   editable: true,
      //   paths:[
      //     {lat: 31.21915044, lng: 121.5273285},
      //     {lat: 31.21515044, lng: 121.5273285},
      //     {lat: 31.21515044, lng: 121.5293285},
      //     {lat: 31.21915044, lng: 121.5293285}
      //   ],
      //   strokeColor:'#2b85e4',
      //   strokeWeight:2,
      //   fillColor:'#2db7f5',
      //   fillOpacity:0.5,
      // },
      
      // [[121.5273285, 31.21915044], [121.5273285, 31.21515044], [121.5293285, 31.21515044] ,[121.5293285, 31.21915044]],

      map_ok:false,

      // rule
      tab:1,
      timeRule:{
        time:[],
        times:[],
        type:3,
        date:[]
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
      unadded: [],
      added: [],
      listStyle: {
        width: '344px',
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
      SelectTime:this.$t('select_time'),
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
      if(n==1){
        if(this.step==0){
          if(this.fenceMes.fenceName==''){
            this.$Message.error(this.$t('fenceName_placeholder1'))
            return
          }
          if(this.fenceMes.fenceDesc==''){
            this.$Message.error(this.$t('fenceName_placeholder2'))
            return
          }
        }

        if(this.step==1){
          this.fenceMes.regcoords = this.$refs.polygon.$$getPath()
          if(this.fenceMes.regcoords.length==0||this.polygon.path.length==0){
            this.$Message.error(this.$t('fenceArea_placeholder'))
            return
          }
        }

        if(this.step==2){
          if(this.timeRule.times.length==0){
            this.$Message.error(this.$t('select_time'))
            return
          }

          this.timeRule.date=[]
          let arr = []
          if(this.timeRule.type==1){
            arr = this.weekList
          }else if(this.timeRule.type==2){
            arr = this.monthList 
          }
          for(let i=0;i<arr.length;i++){
            if(!arr[i]){
              this.timeRule.date.push(i+1)
            }
          }

          if(this.timeRule.type!=3&&this.timeRule.date.length==0){
            this.$Message.error(this.$t('home_echart_select_date'))
            return
          }

          if(this.timeRule.type==3){
            this.timeRule.date=-1
          }
        }

        if(this.step==3){
          if(this.added.length==0){
            this.$Message.error(this.$t('fenceUser_placeholder'))
            return
          }
          this.createFence()
        }
      }

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
    // 成员框中按组织查找
    changeOrg (arr) {
      let _this = this
      this.showTree = false
      this.orgName = arr.orgName
      this.searchParams.orgId = arr.orgId
      this.searchParams.rows = 2147483647
      queryEdposUsers(this.searchParams)
        .then(function (res) {
          _this.unadded = []
          for (let i = 0, arr = res.data.data; i < arr.length; i++) {
            let obj = {
              key: arr[i].uid.toString(),
              label: arr[i].userName + '【' + arr[i].orgName + '】'
            }
            _this.unadded.push(obj)
          }
        })
    },

    createFence(){
      let data = {
        districtFence:{
          partyId:this.partyId,
          fenceName:this.fenceMes.fenceName,
          fenceDesc:this.fenceMes.fenceDesc,
          fenceType:this.fenceMes.fenceType,
          regcoords:this.fenceMes.regcoords,
          alarmLevel:this.fenceMes.alarmLevel
        },
        districtFenceUser:{
          ids:this.added,
          type:3,
        },
        districtFenceRule:{
          ruleCondition:this.fenceMes.condition,
          ruleJson:{
            ruleTime:this.timeRule.times,
            ruleDate:this.timeRule.date.join(','),
          },
          ruleType:this.timeRule.type,
        }
        
       
      }
      // console.log(data)
      createFence(data)
      .then(res=>{
        console.log(res)
      })
    },
    refresh(){
      this.orgName = ''
      this.unadded = []
      this.added = []
    },
    filterMethod (data, query) {
      data = data.label
      query = query.toLowerCase()
      return data.toLowerCase().indexOf(query) > -1
    },
    _onChange (targetKeys, direction, moveKeys) {
      this.added = targetKeys
    },
    onSelectedChange (sourceSelectedKeys, targetSelectedKeys) {
      this.leftSelected = sourceSelectedKeys
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
    @import "../../../styles/common.less";
    @import './new-fence.less';
</style>
