<script type="text/javascript">
/* eslint-disable */
</script>
<style rel="stylesheet" lang="less">
    @import "../../styles/common.less";
    @import "./rec-management.less";
</style>

<template>
    <Row :gutter="8" class="rec">
        <Col span="4">
        <Tabs class='myTabs' @on-click="changeTab" :value="CorO">
          <TabPane :label="rec_tab_label1" name="byChannel">
              <div class="channelList">
                <Input v-model="searchText" @on-keyup="_searchText" :placeholder="rec_tab_search_placeholder"></Input>
                <ul>
                  <li v-bind:class="[channelId==item.channelId?'active':'']" v-for="item in myChannelList" :title="item.channelName" :id="item.channelId" @click="_clickChannelList">{{item.channelName}}</li>
                </ul> 
              </div>
          </TabPane>
          <TabPane :label="rec_tab_label2" name="byOrg">
              <org-tree v-on:search="search"></org-tree>
          </TabPane>
        </Tabs>
           	
        </Col>
        <Col span="20">
        	<div class="main">
        		<div class="search">
          			<Select v-model="resourceType" @on-change="_getChannelResouces" style="width:150px;margin-right:10px;">
  				        <Option v-for="item in resourceTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    				    </Select>
    				    <DatePicker @on-change="_getChannelResouces" v-model="DatePickervalue" :value="DatePickervalue" :options="options" type="datetimerange" split-panels format="yyyy-MM-dd HH:mm:ss" :placeholder="rec_tab_datePicker_placeholder" style="width: 300px;margin-right:10px;"></DatePicker>
    				    <Select ref="aaaa" clearable v-model="user" @on-change="_getChannelResouces" filterable style="width:200px">
		                <Option v-for="item in users" :value="item.uid" :key="item.uid">{{ item.userName }}</Option>
		            </Select>
        		</div>
    				<div class="content" ref="content">
  				      <div class="contentshow" v-show="!nocontent" v-for="item in resourceList">
                  <div class="title" style="overflow:hidden">
                    <p style="float:left">{{item.userName}}</p>
                    <p style="float:right">{{item.resourceDate}}</p>
                  </div>
                  <div>
                      <audio width='300px' v-if="item.resType=='mp3'" :src="item.storeUrl" controls></audio>
                      <video width='300px' v-else :src="item.storeUrl" controls></video>
                  </div>
                </div>
                <div class="contenthide" v-show="nocontent">{{$t('rec_tab_oncontent')}}</div>
                <Spin size="large" fix v-if="spinShow"></Spin>
                <p v-show="!nocontent">
                  <Button type="info"  @click="loadMore">{{$t('rec_tab_loadMore')}}</Button>
                </p>
    				</div>
    				
        	</div>
        </Col>
    </Row>
</template>

<script type="ecmascript-6">
import orgTree from '@/view/common-components/org-tree/org-tree'
import {queryChannels} from '@/api/channel'
import {queryEdposUsers} from '@/api/user-manage'
import { getChannelResouces } from '@/api/rec'

Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

export default {
    components:{
        orgTree      
    },
    data () {
    	return{
    		channelId:'',
       	channelList:[],
        orgId:0,
       	myChannelList:[],
        resourceList:[],
       
       	searchText:'',   //频道搜索框
       	resourceType:"all",
       	resourceTypeList:[
       		{
       			value:'all',
       			label:this.$t('rec_tab_resource_type1')
       		},
       		{
       			value:'mp4',
       			label:this.$t('rec_tab_resource_type2')
       		},
       		{
       			value:'mp3',
       			label:this.$t('rec_tab_resource_type3')
       		}
       	],
       	options:{
       		shortcuts: [
       				{
                    text: this.$t('rec_tab_shortcuts1'),
                    value () {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                        return [start, end];
                    }
                },
                {
                    text: this.$t('rec_tab_shortcuts2'),
                    value () {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        return [start, end];
                    }
                },
                {
                    text: this.$t('rec_tab_shortcuts3'),
                    value () {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        return [start, end];
                    }
                },
                {
                    text: this.$t('rec_tab_shortcuts4'),
                    value () {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        return [start, end];
                    }
                }
            ]
       	},
       	DatePickervalue:['',''],
       	user:'',
       	users:[],
       	total:0,
        pages:{
          'page':1,
          'rows':10,
        },
        nocontent:false,
        spinShow:false,
        CorO:'byChannel'     //用于判断是频道查询还是组织查询
	    }
    },
    computed:{
      rec_tab_label1:function(){
        return this.$t('rec_tab_label1')
      },
      rec_tab_search_placeholder:function(){
        return this.$t('rec_tab_search_placeholder')
      },
      rec_tab_label2:function(){
        return this.$t('rec_tab_label2')
      },
      rec_tab_datePicker_placeholder:function(){
        return this.$t('rec_tab_datePicker_placeholder')
      },
    },
    created:function(){
      // this._getUsers()
    },
    mounted:function(){
      this._getUsers()
      this._getChannelList()   
      //在这里调用是为了调用_getChannelResouces()时this.$ref.content不为undefined
    },
    methods:{
       	_getChannelList(){
           	let _this = this
      			queryChannels()
      			.then(function(res){
              if(res.data.data.length>0){
                _this.channelList = res.data.data
                _this.channelId = res.data.data[0].rid
                _this._turnChannelList()
                _this._getChannelResouces()  //在这里调用是为了确保首次加载时channelId不为空
              }
      				
      			})
       	},
        _getUsers(){
          let _this = this
          queryEdposUsers({'displayState':99})
          .then(function(res){
            _this.users = res.data.data
          })
        },
       	_clickChannelList(event){
       		let li = event.currentTarget
       		this.channelId = li.id
          this._getChannelResouces()
       	},
       	_searchText(){
       		if(this.searchText==''){
    				this._turnChannelList()
    				return 
    			}
       		this.myChannelList = []
          console.log(this.channelList)
       		for(let i=0;i<this.channelList.length;i++){
       			if(this.channelList[i].name.indexOf(this.searchText)>=0){
              console.log()
       				let obj = {
    						'channelId':this.channelList[i].rid,
    						'channelName':this.channelList[i].name
    					}
					     this.myChannelList.push(obj)
	       		}
       		}
       	},
       	_turnChannelList(){
       		this.myChannelList = []
       		for(let i=0;i<this.channelList.length;i++){
    				let obj = {
    					'channelId':this.channelList[i].rid,
    					'channelName':this.channelList[i].name
    				}
    				this.myChannelList.push(obj)
    			}
       	},
        _getChannelResouces(){//首次加载，或更换条件后加载
          this.pages.page=1
          this.$refs.content.scrollTop = 0
          this.spinShow=true
          let _this = this
          let params={
            'uid':this.user || 0,
            'startTime':this.DatePickervalue[0]==""?"":new Date(this.DatePickervalue[0]).Format('yyyy-MM-dd hh:mm:ss'),
            'endTime':this.DatePickervalue[0]==""?"":new Date(this.DatePickervalue[1]).Format('yyyy-MM-dd hh:mm:ss'),
            'resType':this.resourceType,
            'page':this.pages.page,
            'rows':this.pages.rows,
            'rid':this.channelId,
            'orgId':this.orgId,
            'qryType':this.CorO
          }
          if(params.resType=='all'){
            params.resType=''
          }
          if(this.CorO=='byChannel'){
            params.orgId = ''
            params.uid = 0
            // this.user=''
            // this.users=[]
          }else if(this.CorO=='byOrg'){
            params.rid = ''
          }
          getChannelResouces(params)
          .then(function(res){
            for(let i=0,arr=res.data.rows;i<arr.length;i++){
                arr[i].resourceDate = new Date(arr[i].resourceDate).Format('yyyy年MM月dd日 hh:mm:ss')
            }
            _this.resourceList = res.data.rows
            _this.spinShow=false
            _this.nocontent = res.data.rows.length==0?true:false
          })



        },
        loadMore(){  //加载更多
          this.spinShow=true
          this.pages.page+=1
          let _this = this
          let params={
            'uid':this.user || 0,
            'startTime':this.DatePickervalue[0]==""?"":new Date(this.DatePickervalue[0]).Format('yyyy-MM-dd hh:mm:ss'),
            'endTime':this.DatePickervalue[0]==""?"":new Date(this.DatePickervalue[1]).Format('yyyy-MM-dd hh:mm:ss'),
            'resType':this.resourceType,
            'page':this.pages.page,
            'rows':this.pages.rows,
            'rid':this.channelId,
            'orgId':this.orgId,
            'qryType':this.CorO
          }
          if(this.CorO=='byChannel'){
            params.orgId = ''
          }else if(this.CorO=='byOrg'){
            params.rid = ''
          }
          getChannelResouces(params)
          .then(function(res){
            if(res.data.rows.length==0){
              _this.$Message.info(_this.$t('rec_tab_nomore'))
              return
            }
            for(let i=0,arr=res.data.rows;i<arr.length;i++){
                arr[i].resourceDate = new Date(arr[i].resourceDate).Format('yyyy年MM月dd日 hh:mm:ss')
            }
            _this.resourceList = _this.resourceList.concat(res.data.rows)
          })
          _this.spinShow=false
        },
        search(arr){    //点击组织树查找
          let _this = this
          if(arr){
              this.orgId = arr[1]
          }else{
              this.orgId = 0
          }
          _this.user=""
          this._getChannelResouces()
          // 获取该组织下人员
          queryEdposUsers({'orgId':this.orgId,'displayState':99})
          .then(function(res){
              _this.$refs.aaaa.clearSingleSelect()
              if(res.data.data.length>=0){
                _this.users = res.data.data
              }
          })
        },
        changeTab(n){
          if(n=='byChannel') this._getUsers()
          this.CorO = n
        }
    }
}

</script>

