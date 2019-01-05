<template>
    <div class="district_fence">
      <div class="btns">
        <Input search enter-button clearable @on-change="clear" @on-search="search" v-model="searchMes.fenceName" :placeholder="fenceName_placeholder" style="width: 280px;float:left"></Input>
        <Select v-model="searchMes.fenceType" clearable style="width:200px;float:left;margin-left:20px;" :placeholder="fenceType_placeholder"  @on-change="search">
            <Option value="1" key="1">{{ $t('No_entry') }}</Option>
            <Option value="2" key="2">{{ $t('Prohibit_going_out') }}</Option>
        </Select>
        <Button type="primary" @click="openAddFence" style="float:right">{{$t('user_table_btn_add')}}</Button>
      </div>
      <div class="records" ref="records">
        <Spin fix size="large" v-show="spin"></Spin>
        <Table stripe :columns="columns" :data="tableData" ></Table>
      </div>
      <div class="recordsPage">
          <div style="float: right;">
              <Page
                    ref='pages'
                    @on-change="changePage"
                    @on-page-size-change="changePageSize"
                    :total=pages.total
                    :page-size-opts = "[10,20,50]"
                    show-elevator
                    show-sizer
                    show-total
                    placement="top"
                ></Page>
          </div>
      </div>
     
      </div>
      
</template>

<script type="ecmascript-6">
import { queryFence } from '@/api/fence'
import { dateFormat } from '@/libs/tools'
import VueAMap from "vue-amap";   //在页面中引入高德地图
let amapManager = new VueAMap.AMapManager();
export default {
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
        fenceType:'',
        regcoords:''
      },
      pages: {
        page: 1,
        rows: 10,
        total: 0
      },
      modal1:false,
      step:0,
      zoom: 13,
      center: [0,0],
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
      map_ok:false,
      polygon:{
        draggable: true,
        editable: true,
        // path: [[121.5273285, 31.21915044], [121.5273285, 31.21515044], [121.5293285, 31.21515044] ,[121.5293285, 31.21915044]],
        path: [[121.472257,31.236187], [121.492257,31.236187], [121.492257,31.216187] ,[121.472257,31.216187]],
        strokeColor:'#2b85e4',
        strokeWeight:2,
        fillColor:'#2db7f5',
        fillOpacity:0.5,
        events: {
          adjust: () => {
            this.fenceMes.regcoords=this.$refs.polygon.$$getPath()
            console.log(this.$refs.polygon.$$getPath())
          }
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
      newfenceFinish:this.$t('newfenceFinish'),
    }
  },

  created: function () {
    this.queryFence()
    // this.getLocation()
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
      this.polygon.path=[[121.472257,31.236187], [121.492257,31.236187], [121.492257,31.216187] ,[121.472257,31.216187]],
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
      //   if(this.fenceMes.regcoords==''){
      //     this.$Message.error(this.$t('fenceArea_placeholder'))
      //     return
      //   }
      // }

      this.step+=n
    },
    drawPolygon(){
         //在地图中添加MouseTool插件
       mouseTool.polygon({
        strokeColor: "#FF33FF", 
        strokeOpacity: 1,
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillColor: '#1791fc',
        fillOpacity: 0.4,
        // 线样式还支持 'dashed'
        strokeStyle: "solid",
        // strokeStyle是dashed时有效
        // strokeDasharray: [30,10],
      })
    },
    getLocation(){
      let options={
          enableHighAccuracy:true, 
          maximumAge:1000
      }
      if(navigator.geolocation){
          //浏览器支持geolocation
          navigator.geolocation.getCurrentPosition(
            (position)=>{
              //返回用户位置
              //经度
              let longitude =position.coords.longitude;
              //纬度
              let latitude = position.coords.latitude;
              console.log(longitude,latitude)
            },
            (error)=>{
              switch(error.code){
                  case 1:
                  alert("位置服务被拒绝");
                  break;

                  case 2:
                  alert("暂时获取不到位置信息");
                  break;

                  case 3:
                  alert("获取信息超时");
                  break;

                  case 4:
                  alert("未知错误");
                  break;
              }
            },
            options
          );
          
      }else{
          //浏览器不支持geolocation
      }
    },

  },
  computed: {

  },
  mounted: function () {
    window.document.title = localStorage.getItem('platformNameLong')
  }

}
</script>

<style rel="stylesheet" lang="less">
    @import "../../../styles/common.less";
    @import './district-fence.less';
</style>
