<template>
    <div class="call_records">
      <div class="btns">
        <Select v-model="searchMes.rid" filterable style="width:200px;float:left" :placeholder="select_group"  @on-change="search">
            <Option v-for="item in group_List" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="searchMes.uid" filterable style="width:200px;float:left;margin-left:20px;" :placeholder="select_user"  @on-change="search">
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
      spin: false,
      searchMes: {
        rid: '',
        uid: '',
        queryDate: new Date(),
        queryTime: ['00:00:00', '23:59:59']
      },
      columns: [
        {
          title: this.$t('user_table_modal1_userName_label'),
          key: 'userName',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.userName,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.userName)
            ])
          }
        },
        {
          title: this.$t('startTime'),
          key: 'startTime',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.startTime,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.startTime)
            ])
          }
        },
        {
          title: this.$t('endTime'),
          key: 'endTime',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.endTime,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.endTime)
            ])
          }
        },
        {
          title: this.$t('timeLength'),
          key: 'timeLength',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.timeLength,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.timeLength)
            ])
          }
        }

      ],
      tableData: [],
      pages: {
        page: 1,
        rows: 10,
        total: 0
      },
      group_List: [],
      user_List: [],
      select_group: this.$t('select_group'),
      select_user: this.$t('select_user'),
      select_time: this.$t('select_time'),
      home_echart_select_date: this.$t('home_echart_select_date')
    }
  },

  created: function () {
    const _this = this
    queryEdposUsers()
      .then(res => {
        _this.user_List = _this.turnList(res.data.data, 'uid', 'userName')
      })
    queryChannels()
      .then(res => {
        _this.group_List = _this.turnList(res.data.data, 'rid', 'name')
        // _this.searchMes.rid = _this.group_List[0].value
        _this.getRecords()
      })
  },
  methods: {
    getRecords () {
      let _this = this
      let param = {
        page: this.pages.page,
        rows: this.pages.rows
      }
      let data = {
        rid: this.searchMes.rid,
        uid: this.searchMes.uid,
        queryDate: this.searchMes.queryDate ? dateFormat(new Date(this.searchMes.queryDate), 'yyyy-MM-dd') : dateFormat(new Date(), 'yyyy-MM-dd'),
        startTime: this.searchMes.queryTime[0] ? dateFormat(new Date(this.searchMes.queryDate), 'yyyy-MM-dd') + ' ' + this.searchMes.queryTime[0] : '',
        endTime: this.searchMes.queryTime[1] ? dateFormat(new Date(this.searchMes.queryDate), 'yyyy-MM-dd') + ' ' + this.searchMes.queryTime[1] : ''
      }
      queryRoomMicRecord(param, data)
        .then(res => {
          if (res.data.code == 0) {
            res.data.data.forEach(item => {
              item.timeLength = (item.endTime - item.startTime) / 1000 + ' s'
              item.startTime = dateFormat(new Date(item.startTime), 'yyyy-MM-dd hh:mm:ss')
              item.endTime = dateFormat(new Date(item.endTime), 'yyyy-MM-dd hh:mm:ss')
            })
            _this.tableData = res.data.data
            _this.pages.total = res.data.count
          }
        })
    },
    search () {
      this.$refs.pages.currentPage = 1
      this.pages.page = 1
      this.getRecords()
    },
    changePage (current) {
      this.pages.page = current
      this.getRecords()
    },
    changePageSize (current) {
      this.pages.rows = current
      this.getRecords()
    },
    turnList (data, value, label) {
      let list = []
      data.forEach(function (item) {
        let obj = {
          value: item[value],
          label: item[label]
        }
        list.push(obj)
      })
      return list
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
    @import "../../styles/common.less";
    @import './call-records.less';
</style>
