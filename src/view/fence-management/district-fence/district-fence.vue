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
      <Modal
        :title="newFence"
        v-model="modal1"
        class='new_fence'
        :width='800'
      >
        <div class="steps" style="padding-left:10%;margin:10px 0;">
          <Steps :current="step" size="small">
            <Step :title="newfenceName"></Step>
            <Step :title="newfenceArea"></Step>
            <Step :title="newfenceRules"></Step>
            <Step :title="newfenceFinish"></Step>
          </Steps>
        </div>
        <Divider />
        <div class="content">
          <div class="newfenceName" v-if="step==0">
            <p>
              <span>{{this.$t('name')}}：</span>
              <Input clearable v-model="fenceMes.fenceName" :max="100" :placeholder="fenceName_placeholder1" style="width:300px;"></Input>
            </p>
            <p>
              <span>{{this.$t('desc')}}：</span>
              <Input type='textarea' :autosize="{'minRows': 3,'maxRows': 5}" clearable v-model="fenceMes.fenceDesc" :max="100" :placeholder="fenceName_placeholder2" style="width:300px;"></Input>
            </p>
          </div>           
          <div class="newfenceArea" v-if="step==1">
            <el-amap
                vid="amap" :zoom="zoom" :amap-manager="amapManager" :center="center"
                ref="map"
                class="amap-demo"
                >

                </el-amap-marker>
            </el-amap>
          </div>           
          <div class="newfenceRules" v-if="step==2">
            2
          </div>           
          <div class="newfenceFinish" v-if="step==3">
            3
          </div>           
        </div>
        <div slot="footer">
            <Button type="default" v-if="step!=0&&step!=3" @click="changeStep(-1)">{{$t('prev')}}</Button>
            <Button type="primary" v-if="step!=3" @click="changeStep(1)">{{$t('next')}}</Button>
            <Button type="primary" v-if="step==3" @click="modal1=false">{{$t('finish')}}</Button>
        </div>
      </Modal>
      </div>
      
</template>

<script type="ecmascript-6">
import { queryFence } from '@/api/fence'
import { dateFormat } from '@/libs/tools'
import VueAMap from "vue-amap";   //在页面中引入高德地图
let amapManager = new VueAMap.AMapManager();
export default {
  data () {
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
      modal1:true,
      step:0,
      zoom: 13,
      center: [121.482257,31.226187],
      amapManager: amapManager,
      map_ok:false,

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
    }

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
