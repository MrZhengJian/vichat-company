<template>
    <div class="call_records">
      <div class="btns">        
        <Select v-model="searchMes.rid" filterable style="width:200px;float:left" clearable :placeholder="select_group"  @on-change="search">
            <Option v-for="item in group_List" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="searchMes.uid" filterable style="width:200px;float:left;margin-left:20px;" clearable :placeholder="select_user"  @on-change="search">
            <Option v-for="item in user_List" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <DatePicker v-model="searchMes.queryDate" type="date" clearable :placeholder="home_echart_select_date" style="width:200px;float:left;margin-left:20px;" @on-change="search"></DatePicker>
        <TimePicker v-model="searchMes.queryTime" type="timerange" clearable :placeholder="select_time" style="width:200px;float:left;margin-left:20px;" @on-change="search"></TimePicker>
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
import { queryRoomMicRecord } from '@/api/call-records'
import { queryEdposUsers } from '@/api/user-manage'
import { queryChannels } from '@/api/channel'
import { getSession } from '@/api/user'
import { dateFormat } from '@/libs/tools'
export default {
    data () {
        return {
          spin:false,
          searchMes:{
            rid:'',
            uid:'',
            queryDate:new Date(),
            queryTime:[],
          },
          columns:[
              {
                title: this.$t('home_echart_date'),
                key: 'createTime',
                width:150,
                ellipsis: true,
                render: (h, params) => {
                  return h('Tooltip', {
                    props: { placement: 'top-start' }
                  }, [
                    params.row.createTime,
                    h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.createTime)
                  ])
                }
              },
              
              {
                title: this.$t('turn_out'),
                key: 'myName',
                ellipsis: true,
                render: (h, params) => {
                  return h('Tooltip', {
                    props: { placement: 'top-start' }
                  }, [
                    params.row.myName,
                    h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.myName)
                  ])
                }
              },
              {
                title: this.$t('turn_in'),
                key: 'objName',
                ellipsis: true,
                render: (h, params) => {
                  return h('Tooltip', {
                    props: { placement: 'top-start' }
                  }, [
                    params.row.objName,
                    h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.objName)
                  ])
                }
              },
              {
                title: this.$t('alarmType'),
                key: 'busiState',
                ellipsis: true,
                render: (h, params) => {
                  return h('Tooltip', {
                    props: { placement: 'top-start' }
                  }, [
                    params.row.busiState,
                    h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.busiState)
                  ])
                }
              },
              {
                title: this.$t('beforeBalance'),
                key: 'chgBefore',
                ellipsis: true,
                render: (h, params) => {
                  return h('Tooltip', {
                    props: { placement: 'top-start' }
                  }, [
                    params.row.chgBefore,
                    h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.chgBefore)
                  ])
                }
              },
              
              {
                title: this.$t('value'),
                key: 'chgValue',
                ellipsis: true,
                render: (h, params) => {
                  return h('Tooltip', {
                    props: { placement: 'top-start' }
                  }, [
                    params.row.chgValue,
                    h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.chgValue)
                  ])
                }
              },
              {
                title: this.$t('afterBalance'),
                key: 'chgAfter',
                ellipsis: true,
                render: (h, params) => {
                  return h('Tooltip', {
                    props: { placement: 'top-start' }
                  }, [
                    params.row.chgAfter,
                    h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.chgAfter)
                  ])
                }
              },
              {
                title: this.$t('operator'),
                key: 'dealName',
                ellipsis: true,
                render: (h, params) => {
                  return h('Tooltip', {
                    props: { placement: 'top-start' }
                  }, [
                    params.row.dealName,
                    h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.dealName)
                  ])
                }
              },
              {
                  title: this.$t('user_table_col_action'),
                  key: 'action',
                  align: 'center',
                  width:150,
                  fixed: 'right',
                  render: (h, params) => {
                      return h('div', [
                          h('Button',
                              {
                                  on: {
                                      click: () => {
                                        this.remarkContent =  params.row.ext1 || ''
                                        this.remarkDesc =  params.row.remark || ''
                                        this.logId = params.row.logId
                                        this.modal1 = true
                                      }
                                  },
                                  style:{
                                      // display:this.accessList.child_agent_recharge?'inline-block':'none',
                                      cursor:'pointer',
                                      color:'#2DB7F5'
                                  },
                                  props: {
                                      type: 'text',
                                      size: 'small'
                                  } 
                              },this.$t('remark')),
                          
                      ]);
                  }
              }
          ],
          tableData:[],
          pages:{
            page:1,
            rows:10,
            total:0
          },
          group_List:[],
          user_List:[],
          select_group:this.$t('select_group'),
          select_user:this.$t('select_user'),
          select_time:this.$t('select_time'),
          home_echart_select_date:this.$t('home_echart_select_date'),
        }
    },
   
    created:function(){
      const _this = this
      queryEdposUsers()
      .then(res=>{
        _this.user_List = _this.turnList(res.data.data,'uid','userName')
      })
      queryChannels()
      .then(res=>{
        _this.group_List = _this.turnList(res.data.data,'rid','name')
        _this.searchMes.rid = _this.group_List[0].value
        _this.getRecords()
      })
    },
    methods: {
        getRecords(){
          let param = {
            rid:this.searchMes.rid,
            uid:this.searchMes.uid,
            queryDate:dateFormat(new Date(this.searchMes.queryDate),'yyyy-MM-dd')||'',
            startTime:this.searchMes.queryTime[0]||'',
            endTime:this.searchMes.queryTime[1]||'',
            page:this.pages.page,
            rows:this.pages.rows
          }
          queryRoomMicRecord(param)
          .then(res=>{
            console.log(res)
          })
        },
        search(){
          this.$refs.pages.currentPage = 1
          this.getRecords()
        },
        changePage(current){
          this.pages.page = current
          this.getRecords()
        },
        changePageSize(current){
          this.pages.rows = current
          this.getRecords()
        },
        turnList(data,value,label){
          let list = []
          data.forEach(function(item){
            let obj={
              value:item[value],
              label:item[label],
            }
            list.push(obj)
          })
          return list
        }
    },
    computed:{
        
    },
    mounted:function(){
        window.document.title = localStorage.getItem('platformNameLong')
    }

};    
</script>

<style rel="stylesheet" lang="less">
    @import "../../styles/common.less";
    @import './call-records.less';
</style>