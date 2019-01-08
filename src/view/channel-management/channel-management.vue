<script type="">
// eslint-disable-next-line
/* eslint-disable */
</script>

<style rel="stylesheet" lang="less">
    @import "../../styles/common.less";
    @import "./channel-management.less";
</style>

<template>
	<div class="channelTable">
		<div class="btns">
			<Button style="float:right" type="primary" @click="modal1=true">
				{{$t('channel_add_btn')}}
			</Button>
			
      <Input search enter-button clearable @on-search="_searchText" v-model="searchText" :placeholder="channel_search_placeholder" style="width: 250px;float:left"></Input>

		</div>
	    <div class="channel" ref="channel">
        <Spin fix size="large" v-show="spin"></Spin>
	    	<Table :row-class-name="rowClassName" stripe :columns="columns" :data="tableData" ></Table>
	    </div>
	    <div class="channelPage">
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
	    	:title="channel_add_btn"
	    	v-model="modal1"
	    	@on-visible-change="clearChannelFrom"
	    	class="addChannel"
	    	>
	    	<div class="addChannel_modal_body">
	    		<p>
	    			<span>{{$t('channel_modal1_name_label')}}</span>
	    			<Input v-model="addchannelForm.name" :maxlength='20' :placeholder="channel_modal1_name_placeholder" style="width: 300px"></Input>
	    		</p>
	    		<p>
	    			<span>{{$t('channel_modal1_type_label')}}</span>
	    			<Select v-model="addchannelForm.style" style="width:300px">
				        <Option v-for="item in channelTypeList1" :value="item.value" :key="item.value">{{ item.desc }}</Option>
				    </Select>
	    		</p>

	   
	    	</div>
        <div slot="footer">
            <Button type="default" size="large" @click="modal1=false">
                {{$t('cancel')}}
            </Button>
            <Button type="primary" size="large" @click="_addChannel">
                {{$t('ok')}}
            </Button>
        </div>
	    </Modal>
	    <Modal
	    	:title='channel_modal2_title'
	    	v-model="modal2"
	    	class="deleteModal"
	    	>
	    	<p class="deleteP">{{$t('channel_modal2_content')}}</p>
        <div slot="footer">
            <Button type="default" size="large" @click="modal2=false">{{$t('cancel')}}</Button>
            <Button type="primary" size="large" @click="_deleteChannel">{{$t('ok')}}</Button>
        </div>
	    </Modal>
	    <Modal
  			:title="channel_modal3_title"
  			v-model="modal3"
  			class="addChannel"
	    	>
	    	<div class="addChannel_modal_body">
	    		<p>
	    			<span>{{$t('channel_modal1_name_label')}}</span>
	    			<Input v-model="channelForm.name" :maxlength='20' :placeholder="channel_modal1_name_placeholder" style="width: 300px"></Input>
	    		</p>
	    		<p>
	    			<span>{{$t('channel_modal1_type_label')}}</span>
	    			<Select v-model="channelForm.style" style="width:300px">
				        <Option v-for="item in channelTypeList1" :value="item.value" :key="item.value">{{ item.desc }}</Option>
				    </Select>
	    		</p>


	    	</div>
        <div slot="footer">
            <Button type="default" size="large" @click="modal3=false">{{$t('cancel')}}</Button>
            <Button type="primary" size="large" @click="_sendModify">{{$t('ok')}}</Button>
        </div>
	    </Modal>

	</div>
</template>

<script type="ecmascript-6">

/* eslint-disable */
import orgTree from '@/view/common-components/org-tree/table-tree'
import { queryChannels, saveChannel, deleteChannel, loadRoomCache, switchRec } from '@/api/channel'
import { dateFormat } from '@/libs/tools.js'

export default {
  components: {
    orgTree
  },
  data () {
    
    return {
      columns: [
		
        {
          title: this.$t('channel_col_channelName'),
          key: 'name',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top' }
            }, [
              params.row.name,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.name)
            ])
          }

        },
        {
          title: this.$t('channel_col_channelType'),
          key: 'style',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top' }
            }, [
              params.row.style,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.style)
            ])
          }
        },
       
        {
          title: this.$t('channel_founder'),
          key: 'ownerName',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top' }
            }, [
              params.row.ownerName,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.ownerName)
            ])
          }
        },
        {
          title: this.$t('channel_col_switch'),
          render: (h, params) => {
            let _this = this
              return h('div', [
                h('i-switch',{
                      on: {
                        input: function (event) {  //这里会起到监听的作用
                          if (event) { params.row.record = 1 } 
                          else { params.row.record = 0 }
                        },
                        'on-change': () => {
                          // console.log(this.$store.state.user.record)
                            switchRec({
                              'rid':params.row.rid,
                              'recSwitch':params.row.record==1?'U':'X'
                            })
                        }
                      },
                      props: {
                          value:params.row.record==1,
                          disabled:!this.$store.state.user.record
                      }  
                  })
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
          title: this.$t('channel_col_action'),
          key: 'action',
          align: 'center',
          width: 300,
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
                        	h('Button', {
                on: {
                  click: () => {
                    this.jump(params)
                  }
                },
                style: {
                  display: 'inline-block',
                  marginRight: '5px',
                  cursor: 'pointer',
                  color: '#2DB7F5'
                },
                props: {
                  type: 'text',
                  size: 'small'
                }
              }, this.$t('member')),
              h('Button', {
                on: {
                  click: () => {
                    // console.log(params)
                    this._modifyChannel(params)
                  }
                },
                style: {
                  display: 'inline-block',
                  marginRight: '5px',
                  cursor: 'pointer',
                  color: (params.row.style==this.$t('Type_StyleId4')||params.row.style==this.$t('Type_StyleId6'))?'#ccc':'#2DB7F5'
                },
                props: {
                  disabled:(params.row.style==this.$t('Type_StyleId4')||params.row.style==this.$t('Type_StyleId6'))?true:false,
                  type: 'text',
                  size: 'small'
                }
              }, this.$t('channel_col_edit')),
              h('Button', {
                on: {
                  click: () => {
                    this.modal2 = true
                    this.DeleteIndex = params.index
                  }
                },
                style: {
                	display: 'inline-block',
                	cursor: 'pointer',
                	color: (params.row.style==this.$t('Type_StyleId6'))?'#ccc':'#F25E43'
                },
                props: {
                  disabled:(params.row.style==this.$t('Type_StyleId6'))?true:false,
                  type: 'text',
                  size: 'small'
                }
              }, this.$t('channel_col_delete'))
            ])
          }
        }
      ],
      tableData: [],
      saveTableData: [], // 备份当前页原始数据
      pages: {
        'total': 0,
        'rows': 10,
        'page': 1
      },
      modal1: false,
      modal2: false,
      modal3: false,
      modal4: false,
      DeleteIndex: 0, // 点击删除时保存当前行的index
      searchText: '',

      addchannelForm: {
        rid: null,
        name: '',
        style: 1,
        pttCtrl: 1,
        capacity: 1000
      },
      channelForm: {
        rid: null,
        name: '',
        style: 1,
        pttCtrl: 1,
        capacity: 1000
      },
      channelTypeList: [
        {desc: this.$t('Type_StyleId1'), value: 1},
        {desc: this.$t('Type_StyleId3'), value: 3},
        {desc: this.$t('Type_StyleId4'), value: 4}      
      ],
      channelTypeList1: [
        {desc: this.$t('Type_StyleId1'), value: 1},
        {desc: this.$t('Type_StyleId3'), value: 3}
      ],
      pttCtrlList: [],
      expireTypeList: [],
      loginTypeList: [],
      offlineCtrlList: [],
      // 用于穿梭框的数据
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
      channelId: '',
      userList: [], // 保存最原始表格数据
      unadded: [],
      added: [],
      boforeModify: [], // 保存最初已添加成员
      listStyle: {
        width: '280px',
        height: '380px'
      },
      spin:false
    }
  },
  created () {
    this._getMes()
  
  },
  mounted () {

  },
  computed: {
    channel_search_placeholder: function () {
      return this.$t('channel_search_placeholder')
    },
    channel_add_btn: function () {
      return this.$t('channel_add_btn')
    },
    channel_modal1_name_placeholder: function () {
      return this.$t('channel_modal1_name_placeholder')
    },
    channel_modal2_title: function () {
      return this.$t('channel_modal2_title')
    },
    channel_modal3_title: function () {
      return this.$t('channel_modal3_title')
    }

  },
  methods: {
    _getMes (n) { // 按分页获取频道

      this.spin = true
      this.tableData = []
      let _this = this
      let params = {
        'page': this.pages.page,
        'limit': this.pages.rows,
        'name':this.searchText,
        'sort':'rid',
        'order':'desc'
      }
      queryChannels(params)
        .then(function (res) {
          // console.log(res.data.count)
         if(res.data.data.length==0&&n=='del'&&_this.pages.page>1){
            _this.pages.page--
            _this._getMes()
         }else{
            _this.pages.total = res.data.count
            _this.spin = false
            _this.saveTableData = JSON.parse(JSON.stringify(res.data.data))
            _this.tableData = _this._turnData(res.data.data)
         }
          
        })
    },
  
    _turnData (arr) {
      // console.log(arr)
      for (let i = 0; i < arr.length; i++) {
        switch (arr[i].pttCtrl) {
          case 0:arr[i].pttCtrl = this.$t('Type_PttCtrl0'); break
          case 1:arr[i].pttCtrl = this.$t('Type_PttCtrl1'); break
          case 2:arr[i].pttCtrl = this.$t('Type_PttCtrl2'); break
        }
        switch (arr[i].style) {
          case 1:arr[i].style = this.$t('Type_StyleId1'); break
          case 2:arr[i].style = this.$t('Type_StyleId2'); break
          case 3:arr[i].style = this.$t('Type_StyleId3'); break
          case 4:arr[i].style = this.$t('Type_StyleId4'); break
          case 5:arr[i].style = this.$t('Type_StyleId5'); break
        }
        if(arr[i].style>=90&arr[i].style<=99){arr[i].style = this.$t('Type_StyleId6')}
        arr[i].createTime = dateFormat(new Date(arr[i].createTime), 'yyyy-MM-dd')
      }
      return arr
    },

    _addChannel () {
      if (this.addchannelForm.name == '') {
        this.$Message.error(this.$t('channel_addChannel_error1'))
        return
      }else if(!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(this.addchannelForm.name)){
        // console.log(this.addchannelForm.name)
        this.$Message.error(this.$t('userName_reg_error'))
        return
      }
    
      let _this = this
      // console.log(this.channelForm)
      saveChannel(this.addchannelForm)
        .then(function (res) {
          if (res.data.code==0) {
            _this.$Message.success(_this.$t('channel_addChannel_ok'))
            _this.tableData = []
            _this._getMes()
            // _this._getChannelList()
            _this.modal1 = false
            _this.addchannelForm= {
              rid: null,
              name: '',
              style: 1,
              pttCtrl: 1,
              capacity: 1000
            }
          }
        })
    },
    _deleteChannel () {
      let _this = this
      // console.log(this.DeleteIndex)
      let channelId = this.tableData[this.DeleteIndex].rid
      let params = {
        'rid': channelId
      }
      deleteChannel(params)
        .then(function (res) {
          if (res.data.code==0) {
            _this.modal2 = false
            _this.$Message.success(_this.$t('channel_deleteChannel_ok'))
            _this.tableData = []
            _this._getMes('del')
            // _this._getChannelList()
          }
        })
    },
    _modifyChannel (param) {
      let index = param.index
      this.channelForm = {
        rid: this.saveTableData[index].rid,
        name: this.saveTableData[index].name,
        style: this.saveTableData[index].style,
        pttCtrl: 1,
        capacity: this.saveTableData[index].capacity

      }
      // console.log(this.channelForm)
      this.modal3 = true
    },
    _sendModify () {
      let _this = this
      if (this.channelForm.name == '') {
        this.$Message.error(_this.$t('channel_addChannel_error1'))
        return
      }else if(!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(this.channelForm.name)){
        this.$Message.error(this.$t('userName_reg_error'))
        return
      }

      saveChannel(this.channelForm)
        .then(function (res) {
          if (res.data.code==0) {
            _this.modal3=false
            _this.$Message.success(_this.$t('channel_modifyChannel_ok'))
            _this.tableData = []
            _this._getMes()
            // _this._getChannelList()
          }
        })
    },
    _searchText () {
      this.$refs.pages.currentPage=1
      this.pages.page=1
      this._getMes() 
    },
    jump (params) {
      localStorage.setItem('company_channelDetailsChannelId', params.row.rid)
      localStorage.setItem('company_channelDetailsChannelName', params.row.name)
      this.$router.push({
        name: 'channel_details'
      })

    },
    filterMethod (data, query) {
      return data.label.indexOf(query) > -1
    },
    changePage (current) {
      this.pages.page = current
      this._getMes()
    },
    changePageSize (current) {
      this.pages.rows = current
      this._getMes()
    },
    clearChannelFrom () {
      this.channelForm = {
        rid: null,
        name: '',
        style: 3,
        pttCtrl: 1,
        capacity: 1000
      }
    },
    turn_type(name,arr){
      for(let i=0;i<arr.length;i++){
        let str = name+arr[i].value
        arr[i].desc = this.$t(str)
      }
    },
    rowClassName(row,index){
        if(row.style==this.$t('Type_StyleId6')){
          return 'alarm-channel';
        }
    }

  }
}
</script>
