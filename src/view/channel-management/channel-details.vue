<style rel="stylesheet" lang="less">
    @import "../../styles/common.less";
    @import "./channel-details.less";
</style>

<template>
    <div class="channel-details">
    	<Card class="header">
    		<div class="avatar">
    			<img src="./djpd.png" alt="">
    		</div>
    		<div class="info">
    			<p class="p1">
    				<span>{{$t('channel_details_channelName_label')}}</span>{{channelName}}
    			</p>
    			<p>
    				<span>{{$t('channel_details_channelCount_label')}}</span>{{channelCount}}人
    			</p>
    		</div>
    		<div class="btns">
    			<Button size="large" @click="back" style="margin-right:20px">
                    {{$t('channel_details_back')}}
                </Button>
    			<Button size="large" @click="addUser" type="primary">
                    {{$t('channel_details_addUser')}}
                </Button>
    		</div>
    	</Card>
        <div class="table">
            <Spin fix size="large" v-show="spin"></Spin>
            <div class="tableTitle">
                <Input search enter-button clearable @on-search="searchBox" v-model="searchTxt" :placeholder="channel_details_table_search_placeholder" style="width: 250px;float:left"></Input>

                <Button type="primary" @click="openModal3">
                    {{$t('channel_details_delete')}}
                </Button>
            </div>
            <div class="detailsTable">
                <Table stripe @on-selection-change="tableSelection" :columns="columns" :data="tableData"></Table>
            </div>
            <div class="detailsPage">
                <div style="float: right;">
                    <Page
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
        <!-- 添加成员 -->
        <Modal
            :title="channel_details_modal1_title"
            v-model="modal1"
            class="channelUserModal"
            width="800"
            >
            <Spin size="large" fix v-if="showSpain"></Spin>
            <div class="tree">
                <div class='selectOrg' >
                    <span class="selectOrg-title">
                        {{$t('channel_details_modal1_selectOrg_label')}}
                    </span>
                    <div class="selectOrg-content">
                        <Input type="text" :placeholder="channel_details_modal1_selectOrg_placeholder" @on-focus="showTree=true" v-model="orgName"  ></Input>
                    </div>
                </div>
                <org-tree v-show="showTree" v-on:changeOrg="changeOrg"></org-tree>

                <div class='selectOrg' >
                    <span class="selectOrg-title">
                        {{$t('priority')}}
                    </span>
                    <div class="selectOrg-content">
                        <Select v-model='priority'>
                            <Option :disabled="item.value==10" v-for="item in priorityList" :value="item.value" :key="item.value">{{ item.desc }}</Option>
                        </Select>

                    </div>
                </div>
                <div class='selectOrg' >
                    <span class="selectOrg-title">
                        {{$t('talkable_time')}}（s）
                    </span>
                    <div class="selectOrg-content">
                        <InputNumber :min="10" :max="1200" v-model="timelen"></InputNumber>
                    </div>
                </div>
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
            <div slot="footer">
                <Button type="default" @click="modal1=false">
                    {{$t('cancel')}}
                </Button>
                <Button type="primary" :disabled="refreshDisabled" @click="_getMes1">
                    {{$t('channel_details_modal1_refresh')}}
                </Button>
                <Button type="primary" @click="_saveModify">
                    {{$t('channel_details_modal1_save')}}
                </Button>
            </div>
        </Modal>

        <!-- 行内删除提示 -->
        <Modal :title="channel_details_modal2_title" v-model="modal2">
            <p style="margin:20px 0;text-align:center;font-size:20px">
                {{$t('channel_details_modal2_content')}}
            </p>
            <div slot="footer">
                <Button type="default" size="large" @click="modal2=false">
                    {{$t('cancel')}}
                </Button>
                <Button type="primary" size="large" @click="confirmDeletion">
                    {{$t('ok')}}
                </Button>
            </div>
        </Modal>
         <!-- 多选删除提示 -->
        <Modal :title="channel_details_modal2_title" v-model="modal3">
            <p style="margin:30px 0;text-align:center;font-size:20px">
                {{$t('channel_details_modal3_content1')}}
                {{selectionUid.length}}
                {{$t('channel_details_modal3_content2')}}
            </p>
            <div slot="footer">
                <Button type="default" size="large" @click="modal3=false">
                    {{$t('cancel')}}
                </Button>
                <Button type="primary" size="large" @click="deleteUsers">
                    {{$t('ok')}}
                </Button>
            </div>
        </Modal>
        <Modal :title="modal4_title" v-model="modal4">
            <Form :model="empMes" :label-width="120">
                <FormItem :label="user_table_col_role" >
                    <Select v-model="empMes.adminGrade" style="width:300px" >
                        <Option v-for="item in adminGradeList" :value="item.value" :key="item.value">{{ item.desc }}</Option>
                    </Select>
                </FormItem>
                <FormItem :label="priorityLabel" >
                    <Select v-model="empMes.priority" style="width:300px" >
                        <Option v-for="item in priorityList" :disabled='item.value==10&&empMes.adminGrade!=10' :value="item.value" :key="item.value">{{ item.desc }}</Option>
                    </Select>
                </FormItem>
                <FormItem :label="timelenLabel" style="width:300px">
                    <InputNumber :min="10" :max="1200" style="width:300px" v-model="empMes.timelen"></InputNumber>
                </FormItem>
                <FormItem :label="videolenLabel" style="width:300px">
                    <InputNumber :min="0" :max="1200" style="width:300px" v-model="empMes.videolen"></InputNumber>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" size="large" @click="modal4=false">
                    {{$t('cancel')}}
                </Button>
                <Button type="primary" size="large" @click="_saveModify(empMes,1)">
                    {{$t('ok')}}
                </Button>
            </div>
        </Modal>
    </div>

</template>

<script type="ecmascript-6">
import orgTree from '@/view/common-components/org-tree/table-tree'
import { queryRoomMembers, saveRoomMembers, deleteRoomMember, batchDeleteRoomMember, setRoomMemberAdminGrade } from '@/api/channel'
import { batchQueryUsers, queryEdposUsers } from '@/api/user-manage'
import { dateFormat } from '@/libs/tools'
export default {
  components: {
    orgTree
  },
  name: 'channel-details',
  data () {
    return {
      partyId: this.$route.params.partyId || localStorage.getItem('partyId'),
      spin: false,
      showSpain: false,
      channelId: '',
      channelName: '',
      channelCount: 0,
      personData: [],
      originalData: [],
      selectionUid: [],
      leftSelected: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: this.$t('channel_details_table_col_userName'),
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
          title: this.$t('priority'),
          key: 'priority',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.priority,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.priority)
            ])
          }
        },
        {
          title: this.$t('talkable_time'),
          key: 'timelen',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.timelen,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.timelen)
            ])
          }
        },
        {
          title: this.$t('video_time'),
          key: 'videolen',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.videolen,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.videolen)
            ])
          }
        },
        {
          title: this.$t('channel_member_type'),
          key: 'adminGrade',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.adminGrade,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.adminGrade)
            ])
          }
        },
        {
          title: this.$t('channel_details_table_col_action'),
          key: 'action',
          align: 'center',
          width: 200,
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h('Button',
                {
                  on: {
                    click: () => {
                      this.editUser(params)
                    }
                  },
                  style: {
                    display: 'inline-block',
                    color: '#2DB7F5',
                    cursor: 'pointer'
                  },
                  props: {
                    type: 'text',
                    size: 'small'
                  }
                }, this.$t('user_table_col_edit')
              ),
              h('Button',
                {
                  on: {
                    click: () => {
                      this.modal2 = true
                      this.DeleteIndex = params.index
                    }
                  },
                  style: {
                    display: 'inline-block',
                    color: '#F25E43',
                    cursor: 'pointer'
                  },
                  props: {
                    type: 'text',
                    size: 'small'
                  }
                }, this.$t('channel_details_table_col_delete')
              )

            ])
          }
        }
      ],

      modal1: false,
      modal2: false,
      modal3: false,
      modal4: false,
      searchTxt: '',
      // 分页
      pages: {
        'total': 0,
        'rows': 10,
        'page': 1
      },
      priorityList: [
        {
          value: 10,
          desc: this.$t('highest')
        },
        {
          value: 3,
          desc: this.$t('high')
        },
        {
          value: 2,
          desc: this.$t('middle')
        },
        {
          value: 1,
          desc: this.$t('low')
        }
      ],
      adminGradeList: [
        {
          value: 5,
          desc: this.$t('channel_member5')
        },
        {
          value: 10,
          desc: this.$t('channel_member10')
        }
      ],

      empMes: {
        uids: [],
        rid: Number(this.channelId),
        priority: '',
        timelen: 0,
        videolen: 0,
        adminGrade: ''
      },
      // 穿梭框数据
      showTree: false,
      orgName: '',
      orgId: '',
      priority: 2,
      timelen: 120,
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
      refreshDisabled: false
    }
  },
  created () {
    this.channelId = this.$route.params.channelId || localStorage.getItem('company_channelDetailsChannelId')
    this.channelName = this.$route.params.channelName || localStorage.getItem('company_channelDetailsChannelName')

    this.getMes()
  },
  mounted () {
  },
  computed: {
    tableData: function () {
      if (this.personData) {
        for (let i = 0; i < this.personData.length; i++) {
          switch (this.personData[i].priority) {
            case 10:
              this.personData[i].priority = this.$t('highest')
              break
            case 3:
              this.personData[i].priority = this.$t('high')
              break
            case 2:
              this.personData[i].priority = this.$t('middle')
              break
            case 1:
              this.personData[i].priority = this.$t('low')
              break
          }
          switch (this.personData[i].adminGrade) {
            case 5:
              this.personData[i].adminGrade = this.$t('channel_member5')
              break
            case 10:
              this.personData[i].adminGrade = this.$t('channel_member10')
              break
          }
          if (this.personData[i].videolen == 0) {
            this.personData[i].videolen = this.$t('Infinite')
          }
        }
        this.selectionUid = []
        return this.personData
      }
    },
    channel_details_modal1_title: function () {
      return this.$t('channel_details_modal1_title')
    },
    channel_details_modal1_selectOrg_placeholder: function () {
      return this.$t('channel_details_modal1_selectOrg_placeholder')
    },
    channel_details_modal2_title: function () {
      return this.$t('channel_details_modal2_title')
    },
    channel_details_table_search_placeholder: function () {
      return this.$t('channel_details_table_search_placeholder')
    },
    modal4_title: function () {
      return this.$t('user_table_modal2_title')
    },
    priorityLabel: function () {
      return this.$t('priority')
    },
    user_table_col_role: function () {
      return this.$t('user_table_col_role')
    },
    timelenLabel: function () {
      return this.$t('timelen')
    },
    videolenLabel: function () {
      return this.$t('video_time')
    }
  },
  methods: {
    editUser (params) {
      this.empMes.uids = []
      this.empMes.uids.push(params.row.uid)
      this.empMes.timelen = params.row.timelen
      this.empMes.videolen = params.row.videolen
      switch (params.row.priority) {
        case this.$t('highest') :
          this.empMes.priority = 10
          break
        case this.$t('high') :
          this.empMes.priority = 3
          break
        case this.$t('middle') :
          this.empMes.priority = 2
          break
        case this.$t('low') :
          this.empMes.priority = 1
          break
      }
      switch (params.row.adminGrade) {
        case this.$t('channel_member5') :
          this.empMes.adminGrade = 5
          break
        case this.$t('channel_member10') :
          this.empMes.adminGrade = 10
          break
      }
      if (this.empMes.videolen == this.$t('Infinite')) {
        this.empMes.videolen = 0
      }
      this.modal4 = true
    },
    back () {
      this.$router.push({
        name: 'channel'
      })
    },
    // 确认删除时执行删除操作
    confirmDeletion () {
      let _this = this
      let param = {
        'uid': this.tableData[this.DeleteIndex].uid,
        'rid': this.channelId
      }
      deleteRoomMember(param)
        .then(function (res) {
          _this.getMes()
          _this.$Message.success(_this.$t('channel_details_delete_ok'))
        })
      this.modal2 = false
    },
    tableSelection (selection) {
      this.selectionUid = []
      for (var i = 0; i < selection.length; i++) {
        this.selectionUid.push(selection[i])
      }
    },
    searchBox () {
      this.pages.page = 1
      this.getMes()
    },
    addUser () {
      this.modal1 = true
      this.showTree = false
      this.orgName = ''
      this._getMes1()
      // this._getMes()
    },
    getMes () { // 表格数据
      this.spin = true
      let _this = this
      let param = {
        'rid': this.channelId,
        page: this.pages.page,
        limit: this.pages.rows,
        userName: this.searchTxt
      }
      queryRoomMembers(param)
        .then(function (res) {
          // 表格数据(应该在getTableData方法里分页获取)
          _this.personData = res.data.data
          _this.pages.total = _this.channelCount = res.data.count
          _this.spin = false
        })
    },
    // 加载穿梭框数据
    _getMes () { // 右框(频道下成员)
      this.leftSelected = []
      this.selectionUid = []
      let _this = this
      let param = {
        'rid': this.channelId
      }
      queryRoomMembers(param)
        .then(function (res) {
          _this.added = []
          // 添加已添加人员（右框）
          for (let i = 0, arr = res.data.data; i < arr.length; i++) {
            _this.added.push(arr[i].uid + '')
          }

          // 已添加人员设置禁用
          for (let i = 0, arr = _this.unadded; i < arr.length; i++) {
            arr[i].disabled = false
            if (_this.added.indexOf(arr[i].key) > -1) {
              arr[i].disabled = true
              // console.log(arr[i])
            }
          }
          _this.refreshDisabled = false
          _this.showSpain = false
        })
    },
    _getMes1 () { // 左框(所有成员)
      let _this = this
      _this.refreshDisabled = true
      _this.showSpain = true
      _this.unadded = []
      let params1 = {
        'displayState': 99,
        'orgId': 0,
        'userName': '',
        'page': 0,
        'rows': 0
      }
      batchQueryUsers(params1)
        .then(function (res) {
          for (let i = 0, arr = res.data.data; i < arr.length; i++) {
            let obj = {
              key: arr[i].uid.toString(),
              label: arr[i].userName + '【' + arr[i].orgName + '】'
            }
            _this.unadded.push(obj)
          }
          // 所有成员加载完成后，在加载已添加成员
          _this._getMes()
        })
    },
    _onChange (targetKeys, direction, moveKeys) {
      this.added = targetKeys
    },
    onSelectedChange (sourceSelectedKeys, targetSelectedKeys) {
      this.leftSelected = sourceSelectedKeys
    },
    _saveModify (empMes, n) {
      this.searchTxt = ''
      let _this = this
      let params
      if (n && n == 1) {
        if (!empMes.timelen) {
          this.$Message.error(this.$t('timelenError'))
          return
        }
        if (String(empMes.videolen) == 'null') {
          this.$Message.error(this.$t('videolenError'))
          return
        }
        params = empMes
      } else {
        if (!this.timelen) {
          this.$Message.error(this.$t('timelenError'))
          return
        }
        this.showSpain = true

        params = {
          uids: this.added,
          adminGrade: 5,
          priority: this.priority,
          timelen: this.timelen
        }
      }

      params.rid = Number(this.channelId)
      for (let i = 0; i < params.uids.length; i++) {
        params.uids[i] = Number(params.uids[i])
      }
      saveRoomMembers(params)
        .then(function (res) {
          if (res.data.code == 0) {
            _this.showSpain = false
            _this.$Message.success(_this.$t('channel_details_save_ok'))
            _this.getMes()
            _this.modal1 = false
            _this.modal4 = false
          }
        })
    },
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
          _this._getMes()
          // // 已添加人员设置禁用
          // for(let i=0,arr=_this.unadded;i<arr.length;i++){
          //     arr[i].disabled=false
          //     if(_this.added.indexOf(arr[i].key)>-1){
          //         arr[i].disabled=true
          //         // console.log(arr[i])
          //     }
          // }
        })
    },
    // 批量删除
    openModal3 () {
      if (this.selectionUid.length == 0) {
        this.$Message.warning(this.$t('channel_details_delete_error'))
      } else {
        this.modal3 = true
      }
    },
    // 批量删除
    deleteUsers () {
      let _this = this
      for (let i = 0; i < this.selectionUid.length; i++) {
        switch (this.selectionUid[i].adminGrade) {
          case this.$t('channel_member5') :
            this.selectionUid[i].adminGrade = 5
            break
          case this.$t('channel_member10') :
            this.selectionUid[i].adminGrade = 10
            break
        }
        switch (this.selectionUid[i].priority) {
          case this.$t('highest') :
            this.selectionUid[i].priority = 10
            break
          case this.$t('high') :
            this.selectionUid[i].priority = 3
            break
          case this.$t('middle') :
            this.selectionUid[i].priority = 2
            break
          case this.$t('low') :
            this.selectionUid[i].priority = 1
            break
        }
        if (this.selectionUid[i].videolen == this.$t('Infinite')) {
          this.selectionUid[i].videolen = 0
        }
      }
      batchDeleteRoomMember(this.selectionUid)
        .then(function (res) {
          _this.modal3 = false
          _this.$Message.success(_this.$t('channel_details_delete_ok'))
          _this.getMes()
        })
    },
    // 分页
    changePage (current) {
      this.pages.page = current
      this.getMes()
    },
    changePageSize (current) {
      this.pages.rows = current
      this.getMes()
    },
    filterMethod (data, query) {
      data = data.label
      query = query.toLowerCase()
      return data.toLowerCase().indexOf(query) > -1
    }
  }
}
</script>
