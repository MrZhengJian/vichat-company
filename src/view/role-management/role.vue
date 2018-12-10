<script type="text/javascript">
/* eslint-disable */
</script>
<style rel="stylesheet" lang="less">
  @import "../../styles/common.less";
  @import './role.less';
</style>

<template>
  <div class="role">
    <div class="btns">
      <Button style="float:right" type="primary" @click="modal1 = true">{{$t('add_role')}}</Button>
      
      <Input search enter-button clearable @on-search="_searchText" v-model="searchText" :placeholder="search_role_placeholder" style="width: 300px;float:left"></Input>
    </div>
    <div class="table">
      <Table stripe :columns="columns" :data="tableData" ></Table>
    </div>
    <div class="page">
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
      :title='add_role_title'
      v-model="modal1" 
      @on-visible-change="clearRoleForm"
      class="addRole"
      >
      <div class="addChannel_modal_body">
        <Form ref="addRole"  :model="roleForm" :label-width="120" :rules="rules">
            <FormItem :label="role_name"  prop="roleName">
                <Input type="text" v-model="roleForm.roleName" :placeholder="role_name_placeholder" style="width: 300px" ></Input>
            </FormItem>
            <FormItem :label="role_desc"  prop="roleDesc">
                <Input type="text" v-model="roleForm.roleDesc" :placeholder="role_desc_placeholder" style="width: 300px" ></Input>
            </FormItem>
        </Form>
        
      </div>
      <div slot="footer">
          <Button type="text" size="large" @click="modal1=false">{{$t('cancel')}}</Button>
          <Button type="primary" size="large" @click="_addRole(1)">{{$t('ok')}}</Button>
      </div>
    </Modal>
    <Modal 
      :title="edit_role" 
      v-model="modal2" 
      class="addRole"
      >
      <div class="addChannel_modal_body">
        <Form ref="modifyRole"  :model="roleForm" :label-width="120" :rules="rules">
            <FormItem :label="role_name"  prop="roleName">
                <Input type="text" :maxlength="20" v-model="roleForm.roleName" :placeholder="role_name_placeholder" style="width: 300px" ></Input>
            </FormItem>
            <FormItem :label="role_desc"  prop="roleDesc">
                <Input type="text" :maxlength="20" v-model="roleForm.roleDesc" :placeholder="role_desc_placeholder" style="width: 300px" ></Input>
            </FormItem>
        </Form>
        
      </div>
      <div slot="footer">
          <Button type="default" size="large" @click="modal2=false">{{$t('cancel')}}</Button>
          <Button type="primary" size="large" @click="_addRole(2)">{{$t('ok')}}</Button>
      </div>
    </Modal>
    <Modal
      :title='user_table_modal3_title'
      v-model="modal3"
      class="deleteModal"
      >
      <p class="deleteP">{{$t('role_delete_confirm')}}</p>
      <div slot="footer">
          <Button type="default" size="large" @click="modal3=false">{{$t('cancel')}}</Button>
          <Button type="primary" size="large" @click="_deleteRole">{{$t('ok')}}</Button>
      </div>
    </Modal>
     <Modal
      :title='assign_menu'
      v-model="modal4" 
      class="modal4"
      >
      <div style="position:relative">
        <div v-show="modal4spain" class="demo-spin-container">
          <Spin size="large" fix></Spin>
        </div>
        <p class="treeTitle">{{$t('current_role')}}：{{currentRoleName}}</p>
        <Tree ref="tree" @on-check-change="selected" :data="treeData" show-checkbox></Tree>
      </div>
      <div slot="footer">
         <!-- <p style="float:left;height:36px;line-height:36px;"> * [FUNC] {{$t('means_function')}}</p> -->
          <Button type="default" size="large" @click="modal4=false">{{$t('cancel')}}</Button>
          <Button type="primary" size="large" @click="sendTree">{{$t('ok')}}</Button>
      </div>
    </Modal>
  </div>
  
</template>

<script>
import {queryPrisonSecRole,saveOrUpdSecRole,delSecRole,getTree,saveSecRoleFunction,querySecRoleFunctionByRoid} from '@/api/role'
export default {
  inject:['reload'],
  components: {
    
  },
  data () {
    const validateAccount = (rule, value, callback) => {
      value = value.trim()
        if (value === '') {
            callback(new Error(this.$t('role_name_placeholder')));
        } else if (value.length>20) {
            callback(new Error(this.$t('max_len_rules')));
        } else {
            callback()
        }
    };
    const validateDesc = (rule, value, callback) => {
      value = value.trim()
        if (value === '') {
            callback(new Error(this.$t('role_desc_placeholder')));
        } else if (value.length>20) {
            callback(new Error(this.$t('max_len_rules')));
        } else {
            callback()
        }
    };
    return {
      tableData:[],
      saveTableData:[],
      searchText:'',
      columns:[
        {
            title: this.$t('role_name'),
            key: 'roleName',
            ellipsis: true,
            render: (h, params) => {
                return h('Tooltip', {
                    props: { placement: 'top-start' }
                }, [
                    params.row.roleName,
                    h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } },params.row.roleName)
                ])
            }
        },
        {
            title: this.$t('role_desc'),
            key: 'roleDesc',
            ellipsis: true,
            render: (h, params) => {
                return h('Tooltip', {
                    props: { placement: 'top-start' }
                }, [
                    params.row.roleDesc,
                    h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } },params.row.roleDesc)
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
                  h('Button',{
                        on: {
                            click: () => {
                                this.roleForm.roid = params.row.roid
                                this.roleForm.roleName = params.row.roleName
                                this.roleForm.roleDesc = params.row.roleDesc
                                this.modal2 = true
                            }
                        },
                        style:{
                            display:'inline-block',
                            marginRight:'5px',
                            cursor:'pointer',
                            color:'#2DB7F5'
                        },
                        props: {
                            type: 'text',
                          size: 'small'
                        }  
                    },this.$t('channel_col_edit')),
                    h('Button',{
                        on: {
                            click: () => {
                                this.currentRoleName = params.row.roleName
                                this.currentRoleId = params.row.roid
                                this.getTreeDataById()
                                this.modal4 = true
                            }
                        },
                        style:{
                            display:'inline-block',
                            marginRight:'5px',
                            cursor:'pointer',
                            color:'#2DB7F5'
                        },
                        props: {
                            type: 'text',
                          size: 'small'
                        }  
                    },this.$t('assign_menu')),
                    h('Button', {
                        on: {
                            click: () => {
                                this.modal3 = true
                                this.roid = params.row.roid
                            }
                        },
                        style:{
                          display:'inline-block',
                          cursor:'pointer',
                          color:'#F25E43'
                        },
                        props: {
                            type: 'text',
                          size: 'small'
                        }  
                    },this.$t('channel_col_delete'))  
                ]);
            }
        }
      ],
      rules:{
        roleName:[
            {validator: validateAccount, trigger: 'blur'}
        ],
        roleDesc:[
            {validator: validateDesc, trigger: 'blur'}
        ]
      },
      pages:{
        'total':0,
        'rows':10,
        'page':1
      },
      modal1:false,
      modal2:false,
      modal3:false,
      modal4:false,
      modal4spain:false,
      currentRoleName:'',
      currentRoleId:'',
      roleForm:{
        roid:0,
        roleName:'',
        roleDesc:'',
      },
      treeData:[],
      menuList:[]
    }
  },
  created(){
    this.getRoleList()
    // this.getTreeData()
  },
  methods: {
    getRoleList(){
      let _this = this
      queryPrisonSecRole({
        page:this.pages.page,
        limit:this.pages.rows
      })
      .then(res=>{
        if(res.data.code==0){
          _this.pages.total = res.data.count
          _this.tableData = res.data.data
          _this.saveTableData = JSON.parse(JSON.stringify(res.data.data))
        }
      })
    },
    // getTreeData(){
    //   let _this = this
    //   getTree()
    //   .then(res=>{
    //     if(res.data.code==0){
    //       _this.treeData = _this.getTree(res.data)
    //     }
    //   })
    // },
    getTreeDataById(){
      let _this = this
      this.modal4spain = true
      querySecRoleFunctionByRoid({roid:this.currentRoleId})
      .then(res=>{
        if(res.data.code==0){
            _this.treeData = _this.getTree(res.data.obj)
            _this.modal4spain = false
          }
      })
    },
    selected(nodes){
      this.menuList = []
      let _this = this
      // console.log(nodes)
      nodes.forEach(function (element, index, array) {
          if(_this.menuList.indexOf(element.pId+'')<0){
            _this.menuList.push(element.pId+'')
          }
          _this.menuList.push(element.id+'')
      });
      // console.log(_this.menuList)
    },
    
    sendTree(){
      let _this = this
      let params = {
        roleId:this.currentRoleId+'',
        list:this.menuList
      }
      // console.log(this.menuList)
      saveSecRoleFunction(params)
      .then(res=>{
        if(res.data.code==0){
          _this.modal4=false
          _this.$Message.success(_this.$t('channel_modifyChannel_ok'))
        }
       
        // location.reload()
      })
    },

    _searchText(){
      if(this.searchText==''){
        this.tableData = this.saveTableData
        return 
      }
      let temp=[]
      for(let i=0,arr=this.saveTableData;i<arr.length;i++){
        if( arr[i].roleName.indexOf(this.searchText)>=0 || 
          arr[i].roleDesc.indexOf(this.searchText)>=0)
        {
          temp.push(this.saveTableData[i])
        }
      }
      this.$refs.pages.currentPage = 1
      this.tableData = temp
    },
    _addRole(n){
      let _this = this
      if(n==1){
        this.$refs.addRole.validate((valid) => {
          if(valid){
            this.sendRole()
          }
        })
      }else{
        this.$refs.modifyRole.validate((valid) => {
          if(valid){
            this.sendRole()
          }
        })
      }
      
    },
    sendRole(){
      let _this = this
      saveOrUpdSecRole(this.roleForm)
      .then(res=>{
        if(res.data.code == 0){
          if(this.roleForm.roid==0)  _this.$Message.success(_this.$t('channel_addChannel_ok'))
          else _this.$Message.success(_this.$t('channel_modifyChannel_ok'))
          _this.getRoleList()
          _this.modal1=false
          _this.modal2=false
        }
        
      })
    },
    _deleteRole(){
      let _this = this
      delSecRole({roid:this.roid})
      .then(res=>{
        _this.modal3 = false
        _this.$Message.success(_this.$t('channel_deleteChannel_ok'))
        _this.getRoleList()
      })
    },
    changePage(current){
      this.pages.page = current
      this.getRoleList()
    },
    changePageSize(current){
      this.pages.rows = current
      this.getRoleList()
    },
    //转化数据结构
    getTree(data){
        let level1 = []
        let level2 = []
        let level3 = []
        let parents = []
        this.menuList = []
        for(let i=0;i<data.length;i++){
            if(parents.indexOf(data[i].parentFid)<0){
                parents.push(data[i].parentFid)
            }
        }
        for(let x=0;x<data.length;x++){
            if(data[x].isChecked){
              this.menuList.push(data[x].fid+'')
            }
            let obj = {
                'title':data[x].funcType==1?this.$t(data[x].funcDesc):this.$t(data[x].funcDesc)+' [ Action ] ',
                'id':data[x].fid,
                'pId':data[x].parentFid,
                'level':data[x].funcLevel,
                'checked':parents.indexOf(data[x].fid)<0?data[x].isChecked:false
            }
            if(obj.level==1){level1.push(obj)}
            else if(obj.level==2){level2.push(obj)}
            else if(obj.level==3){level3.push(obj)}
        }
        if(this.menuList.length>0){this.menuList.push('0')}
        let tmp = this.level(level2,level3)
        let r = this.level(level1,tmp)
        return r
    },
    level(arr1,arr2){//找到arr2中元素在arr1中对应的父级
        let temp = []
        let r = []
        for(let i=0;i<arr1.length;i++){
            temp[arr1[i]['id']] = arr1[i]
        }
        for (var x=0, l=arr2.length; x<l; x++) {
            if (temp[arr2[x]['pId']] && arr2[x]['id'] != arr2[x]['pId']) {
                if (!temp[arr2[x]['pId']]['children']){
                    temp[arr2[x]['pId']]['children'] = [];
                    temp[arr2[x]['pId']]['expand'] = true;
                    temp[arr2[x]['pId']]['children'].push(arr2[x]);
                }else{
                    temp[arr2[x]['pId']]['children'].push(arr2[x]);
                } 
            }
        }
        for(var key in temp){
          r.push(temp[key])
        }
        return r        
    },
    
    clearRoleForm(){
      this.roleForm={
        roid:0,
        roleName:'',
        roleDesc:'',
      }
    }
  },
  computed:{
    user_table_modal3_title:function(){
      return this.$t('user_table_modal3_title')
    },
    search_role_placeholder:function(){
      return this.$t('search_role_placeholder')
    },
    add_role_title:function(){
      return this.$t('add_role')
    },
    role_name:function(){
      return this.$t('role_name')
    },
    role_desc:function(){
      return this.$t('role_desc')
    },
    role_name_placeholder:function(){
      return this.$t('role_name_placeholder')
    },
    role_desc_placeholder:function(){
      return this.$t('role_desc_placeholder')
    },
    edit_role:function(){
      return this.$t('edit_role')
    },
    assign_menu:function(){
      return this.$t('assign_menu')
    },
  }
  
}
</script>

