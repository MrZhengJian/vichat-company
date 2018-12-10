<script type="">
// eslint-disable-next-line
/* eslint-disable */
</script>

<style rel="stylesheet" lang="less">
    @import "../../styles/common.less";
    @import "./alarm-management.less";
</style>

<template>
	<div class="alarm">
		<div class="btns">
			<Select v-model="alarmState" @on-change="searchChange" style="width:100px;margin-right:10px;">
		        <Option v-for="item in alarmStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
		    </Select>
			<DatePicker @on-change="searchChange" v-model="DatePickervalue" :value="DatePickervalue" type="datetimerange" split-panels format="yyyy-MM-dd HH:mm:ss" :placeholder="rec_tab_datePicker_placeholder" style="width: 300px;margin-right:10px;"></DatePicker>
		</div>	
		<div class="alarmTable" ref="alarmTable">
	    	<Table stripe :columns="columns" :data="tableData" ></Table>
	    </div>
	    <div class="alarmPage">
	        <div style="float: right;">
	            <Page
	            	ref="page"
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
	    <Modal v-model="modal1" width="800" class="alarmMapModal">
	        <p slot="header">
	            <span>{{$t('Map')}}</span>
	        </p>
	        <div class="map">
	            <gmap-map
				    :center="mapCenter"
				    :zoom="15"
				    style="width: 100%; height: 400px"
				>
				    <gmap-marker
				      :position="marker.position"
				      :clickable="true"
				    ></gmap-marker>
				</gmap-map>
	        </div>
	        <div slot="footer">
	            <Button type="primary" size="large" @click="modal1 = false" >{{$t('close')}}</Button>
	        </div>
	    </Modal>
	    <Modal v-model="modal2">
	        <p slot="header">
	            <span>{{$t('alarmHandle')}}</span>
	        </p>
	        <Input v-model="remarkContent" :maxlength="1000" type="textarea" :rows="4" :placeholder="enterRemark" />
	        <div slot="footer">
	            <Button type="default" size="large" @click="modal2=false" >{{$t('close')}}</Button>
	            <Button type="error" size="large" @click="closeConfirm(3)" >{{$t('cancelAlarm')}}</Button>
	            <Button type="primary" v-if="closeMes.alarmState==$t('alarmStateList4')" size="large" @click="closeConfirm(2)" >{{$t('finishAlarm')}}</Button>
	            <Button type="primary" v-if="closeMes.alarmState==$t('alarmStateList1')"  size="large" @click="closeConfirm(4)" >{{$t('dealAlarm')}}</Button>
	        </div>
	    </Modal>
	    <Modal v-model="modal4">
	        <p slot="header">
	            <span>{{$t('close_confirm')}}</span>
	        </p>
	        <h1 style="text-align:center;margin:20px 0">{{fisnishContent}}</h1>
	        <div slot="footer">
	            <Button type="default" size="large" @click="modal4=false" >{{$t('cancel')}}</Button>
	            <Button type="primary" size="large" @click="closeAlarm(2)" >{{$t('ok')}}</Button>
	        </div>
	    </Modal>
	    <Modal v-model="modal3">
	        <p slot="header">
	            <span>{{$t('remark')}}</span>
	        </p>
	        <Input v-model="remarkContent" :maxlength="1000" type="textarea" :rows="4" :placeholder="enterRemark" />
	        <div slot="footer">
	            <Button type="default" size="large" @click="modal3=false">{{$t('cancel')}}</Button>
	            <Button type="primary" size="large" @click="sendRemark">{{$t('ok')}}</Button>
	        </div>
	    </Modal>
	</div>
</template>

<script type="ecmascript-6">
import { dateFormat } from '@/libs/tools.js'
import { queryAlarm,finishAlarm,saveDealResult } from '@/api/alarm'

import * as VueGoogleMaps from 'vue2-google-maps';
import Vue from 'vue';
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyB5DfBgoFxu_8MPchRt79ehKzo8ocG-HIA',
    v: '0.10.2',
    libraries: 'places'
  }
})

export default {
	components: {

	},
	data () {
		return {
			alarmId:0,
			remarkContent:'',
			DatePickervalue:['',''],
			showFounderTree:false,
			founder:'',
			searchText:'',
			pages: {
		        'total': 0,
		        'rows': 10,
		        'page': 1
		    },
			mapCenter:{lat:31.239704, lng: 121.478341},
			marker: {
	          position: {lat:31.239704, lng: 121.478341}
	        },
			partyId:this.$store.state.user.userObj.partyId,
			columns:[
				{
		          title: this.$t('alarmId'),
		          key: 'alarmId',
		          ellipsis: true,
		          render: (h, params) => {
		            return h('Tooltip', {
		              props: { placement: 'top' }
		            }, [
		              params.row.alarmId,
		              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.alarmId)
		            ])
		          }

		        },
		        {
		          title: this.$t('channel_founder'),
		          key: 'uName',
		          ellipsis: true,
		          render: (h, params) => {
		            return h('Tooltip', {
		              props: { placement: 'top' }
		            }, [
		              params.row.uName,
		              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.uName)
		            ])
		          }

		        },
		        {
		          title: this.$t('channel_create_time'),
		          key: 'createTime',
		          ellipsis: true,
		          render: (h, params) => {
		            return h('Tooltip', {
		              props: { placement: 'top' }
		            }, [
		              params.row.createTime,
		              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.createTime)
		            ])
		          }

		        },
		        {
		          title: this.$t('alarmState'),
		          key: 'alarmState',
		          ellipsis: true,
		          render: (h, params) => {
		            return h('Tooltip', {
		              props: { placement: 'top' }
		            }, [
		              params.row.alarmState,
		              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.alarmState)
		            ])
		          }

		        },
		        // {
		        //   title: this.$t('alarmType'),
		        //   key: 'alarmType',
		        //   ellipsis: true,
		        //   render: (h, params) => {
		        //     return h('Tooltip', {
		        //       props: { placement: 'top' }
		        //     }, [
		        //       params.row.alarmType,
		        //       h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.alarmType)
		        //     ])
		        //   }

		        // },
		        {
		          title: this.$t('dealUName'),
		          key: 'dealUName',
		          ellipsis: true,
		          render: (h, params) => {
		            return h('Tooltip', {
		              props: { placement: 'top' }
		            }, [
		              params.row.dealUName,
		              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.dealUName)
		            ])
		          }

		        },{
		          title: this.$t('dealTime'),
		          key: 'dealTime',
		          ellipsis: true,
		          render: (h, params) => {
		            return h('Tooltip', {
		              props: { placement: 'top' }
		            }, [
		              params.row.dealTime,
		              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.dealTime)
		            ])
		          }

		        },
		        {
		          title: this.$t('coordinate'),
		          key: 'coordinate',
		          width:180,
		          ellipsis: true,
		          render: (h, params) => {
		            return h('Tooltip', {
		              props: { placement: 'top' }
		            }, [
		              params.row.coordinate,
		              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.coordinate)
		            ])
		          }

		        },
		        {
		          title: this.$t('user_table_col_action'),
		          key: 'action',
		          align: 'center',
		          fixed: 'right',
		          width:300,
		          render: (h, params) => {
		            return h('div', [
		              h('Button',
		                {
		                  on: {
		                    click: () => {
		                    	this.remarkContent =  params.row.dealResult || ''
		                    	this.alarmId = params.row.alarmId
		                    	this.modal3 = true
		                    }
		                  },
		                  style: {
		                    display: 'inline-block',
		                    color: '#2DB7F5',
		                    marginRight: '5px',
		                    cursor: 'pointer'
		                  },
		                  props: {
		                    type: 'text',
		                    size: 'small',
		                  }
		                }, this.$t('remark')),
		              h('Button',
		                {
		                  on: {
		                    click: () => {
		                    	this.modal1 = true
		                    	if(params.row.hasCoordinate){
		                    		this.marker.position = this.mapCenter={
		                    			lat: parseFloat(params.row.latitude), 
		                    			lng: parseFloat(params.row.longitude)
		                    		}
		                    	}
		                    }
		                  },
		                  style: {
		                    display: 'inline-block',
		                    marginRight: '5px',
		                    color: (params.row.hasCoordinate?'#2DB7F5':'#ccc'),
		                    cursor: 'pointer'
		                  },
		                  props: {
		                    type: 'text',
		                    size: 'small',
		                    disabled:(params.row.hasCoordinate?false:true)
		                  }
		                }, this.$t('Map')),
		              
		              h('Button',
		                {
		                  on: {
		                    click: () => {
		                    	this.closeMes={
		                    		alarmId:params.row.alarmId,
									alarmState:params.row.alarmState,
									uid:this.$store.state.user.userObj.uid,
									partyId:params.row.partyId,
		                    	}
		                    	this.modal2 = true
		                    }
		                  },
		                  style: {
		                    display: 'inline-block',
		                    color: (params.row.alarmState==this.$t('alarmStateList1')||params.row.alarmState==this.$t('alarmStateList4')?'#2DB7F5':'#ccc'),
		                    cursor: 'pointer'
		                  },
		                  props: {
		                    type: 'text',
		                    size: 'small',
		                    disabled:(params.row.alarmState==this.$t('alarmStateList1')||params.row.alarmState==this.$t('alarmStateList4')?false:true)
		                  }
		                }, this.$t('deal'))
		            ])
		          }
		        }
			],
			tableData:[],
			modal1:false,
			modal2:false,
			modal3:false,
			modal4:false,
			fisnishContent:'',
			alarmTypeList:[
				{
					value:1,
					label:this.$t('alarmTypeList1')
				}
			],
			alarmState:0,
			alarmStateList:[
				{
					value:0,
					label:this.$t('all')
				},
				{
					value:1,
					label:this.$t('alarmStateList1')
				},
				{
					value:4,
					label:this.$t('alarmStateList4')
				},
				{
					value:2,
					label:this.$t('alarmStateList2')
				},
				{
					value:3,
					label:this.$t('alarmStateList3')
				}
			],
			closeMes:{
				alarmId:'',
				alarmState:'',
				uid:'',
				partyId:'',
			}
		}
	},
	created () {
		this._getMes()
	},
	mounted () {

	},
	computed: {
		alarm_search_placeholder: function () {
      		return this.$t('alarm_search_placeholder')
    	},
    	searchByFounder: function () {
      		return this.$t('searchByFounder')
    	},
    	rec_tab_datePicker_placeholder:function(){
	        return this.$t('rec_tab_datePicker_placeholder')
	    },
	    enterRemark:function(){
	        return this.$t('enterRemark')
	    },
	},
	methods: {

		_getMes(){
			let _this = this
			let params={
				'partyId':this.partyId,
				'page':this.pages.page,
				'limit':this.pages.rows,
				'alarmState':this.alarmState,
				'startDate':this.DatePickervalue[0]==""?"":dateFormat(new Date(this.DatePickervalue[0]),'yyyy-MM-dd hh:mm:ss'),
            	'endDate':this.DatePickervalue[0]==""?"":dateFormat(new Date(this.DatePickervalue[1]),'yyyy-MM-dd hh:mm:ss'),
			}
			queryAlarm(params)
			.then(function(res){
				_this.tableData = _this._turnData(res.data.data)
				_this.pages.total = res.data.count
			})
		},
		_turnData(data){
			let x,y
			for(let i=0;i<data.length;i++){
				// console.log(data[i].longitude,data[i].latitude)
				if(data[i].longitude&&data[i].latitude){
					y = parseFloat(data[i].longitude).toFixed(6)
					x = parseFloat(data[i].latitude).toFixed(6)
					data[i].hasCoordinate = true
				}else{
					x = y = "-"
					data[i].hasCoordinate = false
				}
				
				data[i].coordinate = "{ "+x+" , "+y+" }"

				switch(data[i].alarmState){
					case 1:
						data[i].alarmState = this.$t('alarmStateList1');
						break;
					case 2:
						data[i].alarmState = this.$t('alarmStateList2');
						break;
					case 3:
						data[i].alarmState = this.$t('alarmStateList3');
						break;
					case 4:
						data[i].alarmState = this.$t('alarmStateList4');
						break;
				}
				switch(data[i].alarmType){
					case 1:
						data[i].alarmType = this.$t('alarmTypeList1');
						break;
				}
				if(!data[i].dealUName) data[i].dealUName = '-'
				if(!data[i].dealTime){
					data[i].dealTime = '-'
				}else{
					data[i].dealTime = dateFormat(new Date(data[i].dealTime),'yyyy-MM-dd hh:mm:ss')
				}
				data[i].alarmTime = dateFormat(new Date(data[i].alarmTime),'yyyy-MM-dd hh:mm:ss')
				data[i].createTime = dateFormat(new Date(data[i].createTime),'yyyy-MM-dd hh:mm:ss')
				
			}
			return data
		},
		searchChange(){
			this.$refs.page.currentPage=1
			this.pages.page = 1
			this._getMes()
		},
		closeConfirm(n){
			this.closeMes.alarmState = n
			
			this.fisnishContent = this.$t('close_confirm_content'+n)
			
			this.modal2 = false
			this.modal4 = true
		},
		closeAlarm(){
			let _this = this
			let url = ''
			// console.log(this.closeMes.alarmState)
			if(this.closeMes.alarmState==4){
				url = '/vcapi/alarm/dealAlarm'
			}else{
				url = '/vcapi/alarm/finishAlarm'
			}

			finishAlarm(url,this.closeMes)
			.then(function(res){
				if(res.data.code==0){
					_this.$Message.success(_this.$t('user_table_modify_ok'))
					_this.modal2 = false
					_this.modal4 = false
					_this._getMes()
				}
			})
		},
		changePage (current) {
	    	this.pages.page = current
	    	this._getMes()
	    },
	    changePageSize (current) {
	    	this.pages.rows = current
	    	this._getMes()
	    },
	    sendRemark(){
	    	let _this = this
	    	
	    		
	    		let params = {
	    			alarmId:this.alarmId,
	    			dealResult:this.remarkContent
	    		}
	    		saveDealResult(params)
	    		.then(function(res){
	    			if(res.data.code==0){
	    				_this.$Message.success(_this.$t('user_table_modify_ok'))
	    				_this._getMes()
	    				_this.modal3 = false
	    			}
	    		})
	    	
	    }
	}
}


</script>