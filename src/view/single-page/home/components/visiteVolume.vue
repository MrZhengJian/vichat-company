<style>
    .logDetails .ivu-modal-header p{
        height: 40px;
        line-height: 40px;
        font-weight: normal;
    }
    .logDetails .ivu-modal-header p div{
        margin-right: 10px;
    }
</style>
<template>
    <div style="width:100%;height:100%;" id="visite_volume_con">
        <div style="width:100%;height:100%;" ></div>
        <Modal v-model="modal1" width="360">
            <p slot="header" style="">
                [{{logName}}]{{$t('home_echart_details')}}
            </p>
            <div style="height:400px;overflow:auto" >
               <div v-for="item in logList" style="padding:5px">
                   <p>{{$t('home_echart_online')}}：{{item.online}}</p>
                   <p>{{$t('home_echart_outline')}}：{{item.offline}}</p>
               </div>
            </div>
            <div slot="footer">

            </div>
        </Modal>
        <Modal class="logDetails" v-model="modal2" width="960">
            <p slot="header" style="">
                <Select v-model="DorM" @on-change="_getLogDetails" style="width:150px">
                    <Option value='0'>{{$t('home_echart_byDay')}}</Option>
                    <Option value='1'>{{$t('home_echart_byMonth')}}</Option>
                </Select>
                <DatePicker v-if="DorM==0" v-model="searchTime" @on-change="_getLogDetails" type="date" :placeholder="home_echart_select_date_placeholder" style="width: 200px"></DatePicker>
                <DatePicker v-if="DorM==1" v-model="searchTime" @on-change="_getLogDetails" type="month" :placeholder="home_echart_select_month_placeholder" style="width: 200px"></DatePicker>
                <Select v-model="user" @on-change="_getLogDetails" filterable clear style="width:200px">
                    <Option v-for="item in users" :value="item.uid" :key="item.uid">{{ item.userName }}</Option>
                </Select>
            </p>
            <div style="height:400px;overflow:auto" >
               <div v-for="item in logDetailsList" style="padding:5px">
                   <div class="title">
                       <div class="left">{{item.uname}}</div>
                       <div class="right">
                           <p>{{$t('home_echart_date')}}：{{item.date}}</p>
                           <p>{{$t('home_echart_online')}}：{{item.onlineTime}}</p>
                       </div>
                   </div>
                   <Progress :percent="item.percent"></Progress>
               </div>
            </div>
            <div slot="footer">

            </div>
        </Modal>
    </div>

</template>

<script>
import echarts from 'echarts'
import { queryEdposUsers } from '@/api/user-manage'
import { logDetails, chartData } from '@/api/home'

Date.prototype.Format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  return fmt
}
export default {

  name: 'visiteVolume',
  data () {
    return {
      chartUrl: {
        'MLogDay': '/vcapi/data/queryOnlineUserMLogDay',
        'MLogMonth': '/vcapi/data/queryOnlineUserMLogMonth'
        // 'DetailByPage':'/wvapi/data/queryOnlineUserDetailByPage',
        // 'DLog':'/wvapi/data/getOnlineUserDLog',
        // 'MLog':'/wvapi/data/getOnlineUserMLog'
      },
      // userUrl:'/wvapi/queryEdposUsers',
      // logDetailsUrl:'/wvapi/data/queryOnlineUserDetailByPage',
      user: 0,
      users: [],
      chartList: [],
      chartXname: [],
      chartXvalue: [],
      DorM: '0', // 当天或者本月，0=天,1=月
      modal1: false,
      modal2: false,
      logList: [],
      logName: '',
      searchTime: '',
      logDetailsList: []

    }
  },
  created: function () {
    this.getChartData('0')
    this._getUsers()
  },
  mounted () {
  },
  methods: {
    _getUsers () {
      let _this = this
      queryEdposUsers()
        .then(function (res) {
          if (res.data.code == 0) {
            _this.users = res.data.data
          }
        })
    },
    _getLogDetails () {
      let _this = this
      let myTime
      if (this.searchTime) {
        myTime = this.DorM == 0 ? new Date(this.searchTime).Format('yyyy-MM-dd') + ' 00:00:00'
          : new Date(this.searchTime).Format('yyyyMM')
      }
      let param = {
        onlineType: this.DorM,
        rows: 0,
        page: 0,
        time: myTime,
        uid: this.user || 0
      }
      logDetails(param)
        .then(function (res) {
          if (res.data.code == 0) {
            _this.logDetailsList = []
            if (!res.data.rows) {
              // _this.$Message.warning(_this.$t('home_echart_nocontent'))
              return
            }
            for (let i = 0, arr = res.data.rows; i < arr.length; i++) {
              let mytime = _this.DorM == '0' ? parseInt(arr[i].second / 60 / 60)
                : parseInt(arr[i].second / 60 / 60 / 24)
              let mydate, myonline, mypercent
              if (_this.DorM == '0') {
                mydate = new Date(arr[i].day).Format('yyyy-MM-dd')
                myonline = mytime + _this.$t('home_echart_hours')
                mypercent = parseInt(mytime / 0.24)
              } else {
                mydate = new Date(arr[i].day).Format('yyyy-MM')
                myonline = mytime + _this.$t('home_echart_days')
                mypercent = parseInt(mytime / 0.30)
              }

              let obj = {
                uname: arr[i].userName,
                date: mydate,
                onlineTime: myonline,
                percent: mypercent
              }
              _this.logDetailsList.push(obj)
            }
          }
        })
    },
    getChartData (n) {
      this.DorM = n
      let url = n == 0 ? this.chartUrl.MLogDay : this.chartUrl.MLogMonth
      let _this = this
      chartData(url)
        .then(function (res) {
          // console.log(res)
          if (res.data.code == 0) {
            if (!res.data.obj) {
              _this.chartXname = []
              _this.chartXvalue = []
              _this.drawChart()
              return
            }
            _this.chartList = res.data.obj
            _this.chartXname = []
            _this.chartXvalue = []
            for (let i = 0, arr = res.data.obj; i < arr.length; i++) {
              _this.chartXname.push(arr[i].userName)
              let obj = {
                value: parseInt(arr[i].second / 60),
                name: arr[i].userName,
                itemStyle: {normal: {color: '#5EA7F4'}}
              }
              _this.chartXvalue.push(obj)
            }
            _this.drawChart()
          }
        })
    },
    openDetails () {
      this.modal2 = true
    },
    drawChart () {
      let _this = this
      let visiteVolume = echarts.init(document.getElementById('visite_volume_con'))

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '3%',
          left: '2%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.chartXname,

          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#222',
              fontSize: '12px'
            },

            formatter: function (params) {
              var newParamsName = ''// 最终拼接成的字符串
              var paramsNameNumber = params.length// 实际标签的个数
              var provideNumber = 4// 每行能显示的字的个数
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber)// 换行的话，需要显示几行，向上取整
              /**
                             * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                             */
              // 条件等同于rowNumber>1
              if (paramsNameNumber > provideNumber) {
                /** 循环每一行,p表示行 */
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = ''// 表示每一次截取的字符串
                  var start = p * provideNumber// 开始截取的位置
                  var end = start + provideNumber// 结束截取的位置
                  // 此处特殊处理最后一行的索引值
                  if (p == rowNumber - 1) {
                    // 最后一次不换行
                    tempStr = params.substring(start, paramsNameNumber)
                  } else {
                    // 每一次拼接字符串并换行
                    tempStr = params.substring(start, end) + '\n'
                  }
                  newParamsName += tempStr// 最终拼成的字符串
                }
              } else {
                // 将旧标签的值赋给新标签
                newParamsName = params
              }
              // 将最终的字符串返回
              return newParamsName
            }
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        series: [
          {
            name: this.$t('home_echart_online_time'),
            type: 'bar',
            data: this.chartXvalue,
            barWidth: 40
          }
        ]
      }

      visiteVolume.setOption(option)
      window.addEventListener('resize', function () {
        visiteVolume.resize()
      })
    }
  },
  computed: {
    home_echart_select_date_placeholder: function () {
      return this.$t('home_echart_select_date')
    },
    home_echart_select_month_placeholder: function () {
      return this.$t('home_echart_select_month')
    }
  }
}
</script>
