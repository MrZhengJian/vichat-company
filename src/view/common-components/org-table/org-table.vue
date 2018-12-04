<script type="text/javascript">
/* eslint-disable */
</script>
<style rel="stylesheet" lang="less" scoped>
    @import "./org-table.less";
</style>

<template>
<div class="orgTable">
    <div class="table-main">
    		<Table stripe :columns="columns" :data="tableData"></Table>
    </div>
		<p class="addBtn">
			<Button style="float:right" type="primary" @click="addOrg">
          {{$t('org_table_addOrg_btn')}}
      </Button>
		</p>

  	<Modal :title="org_table_modal1_title" v-model="modal1">
        <Form ref="form1" :model="form" :rules="rule" :label-width="120">
		        <FormItem :label="org_table_modal1_orgName_label" prop="orgName">
		            <Input type="text" :maxlength="20" v-model="form.orgName" style="width:300px"></Input>
		        </FormItem>
		    </Form>
        <div slot="footer">
            <Button type="default" size="large" @click="modal1=false">{{$t('cancel')}}</Button>
            <Button type="primary" size="large" @click="sendModify">{{$t('ok')}}</Button>
        </div>
    </Modal>
    <Modal @on-visible-change="show=false" :title="org_table_modal2_title" v-model="modal2" class="addorg">
        <Form ref="form2" :model="form" :rules="rule" :label-width="120">
            <FormItem :label="org_table_modal1_orgName_label" prop="orgName">
                <Input type="text" v-model="form.orgName" :maxlength='20' style="width:300px" :placeholder="org_table_modal2_orgName_placeholder"></Input>
            </FormItem>
            <div class='selectOrg'>
                  <span>{{$t('org_table_modal2_parentOrg_label')}}</span>
                    <div class="treeBox">
                        <Input type="text" @on-focus="show=true" :maxlength="20" v-model="form.parentName" style="width: 300px" :placeholder="org_table_modal2_parentOrg_placeholder"></Input>
                    </div>
              </div>
                <org-tree v-show="show" :updateTreeList="updateTreeList" v-on:changeOrg="changeOrg"></org-tree>
        </Form>
        <div slot="footer">
            <Button type="default" size="large" @click="modal2=false">{{$t('cancel')}}</Button>
            <Button type="primary" size="large" @click="sendAdd">{{$t('ok')}}</Button>
        </div>
    </Modal>
    <Modal
        :title="org_table_modal3_title"
        v-model="modal3"
        >
        <p class="deleteP">{{$t('org_table_modal3_content')}}</p>
        <div slot="footer">
            <Button type="default" size="large" @click="modal3=false">{{$t('cancel')}}</Button>
            <Button type="primary" size="large" @click="_deleteOrg">{{$t('ok')}}</Button>
        </div>
    </Modal>
</div>
</template>

<script type="ecmascript-6">
import orgTree from '@/view/common-components/org-tree/table-tree'
import { saveOrg, delOrg } from '@/api/org-manage'
import { orgZTree } from '@/api/user-manage'
export default {
  components: {
    orgTree
  },
  props: {
    orgData: {
      type: Array,
      required: true
    },
    orgId: {
      type: Number
    },
    orgMes: {
      type: Object
    }
  },
  created: function () {
    this._getMes()
  },
  
  data () {
    const validateAccount = (rule, value, callback) => {
        if (value === '') {
            callback(new Error(this.$t('org_table_modify_error1')));
        } else if (value.length>20) {
            callback(new Error(this.$t('max_len_rules')));
        } else {
            callback()
        }
    };
    return {
      saveUrl: '/wvapi/saveEdposOrg',
      modal1: false,
      modal2: false,
      modal3: false,
      DeleteIndex: -1,
      show: false, // 上级组织组织树
      form: {
        orgName: '',
        // contactsSyncRule:1,
        // sort: 0,
        parentName: '',
        orgId: 1, // 修改时使用
        pId: 1 // 查询时使用
      },
      columns: [
        {
          title: this.$t('org_table_col_orgName'),
          align: 'center',
          key: 'orgName',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.orgName,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.orgName)
            ])
          }
        },
        {
          title: this.$t('org_table_col_parentName'),
          align: 'center',
          key: 'parentName',
          ellipsis: true,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top-start' }
            }, [
              params.row.parentName,
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.parentName)
            ])
          }
        },
       
        {
          title: this.$t('org_table_col_action'),
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
                      this.modify(params.index)
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
                }, this.$t('user_table_col_edit')),

              h('Button',
                {
                  on: {
                    click: () => {
                      this.modal3 = true
                      this.DeleteIndex = params.index
                    }
                  },
                  style: {
                    display: 'inline-block',
                    cursor: 'pointer',
                    color: '#F25E43'
                  },
                  props: {
                    type: 'text',
                    size: 'small'
                  }
                }, this.$t('user_table_col_delete'))
            ])
          }
        }
      ],
      state_List: [
        {
          value: 1,
          label: this.$t('org_table_state1')
        },
        {
          value: 2,
          label: this.$t('org_table_state2')
        },
        {
          value: 3,
          label: this.$t('org_table_state3')
        }, 
        {
        	value: 4,
        	label: this.$t('org_table_state4')
        }
      ],
      rule: {
        orgName: [
          {validator: validateAccount, trigger: 'blur'}
        ],
      },
      updateTreeList:[]
    }
  },
  methods: {
    _getMes () {
      this.$emit('search')
    },
    
    modify (index) {
      this.modal1 = true
      this.form.orgName = this.orgData[index].orgName
      // this.form.contactsSyncRule=this.orgData[index].contactsSyncRule
      // this.form.sortno = this.orgData[index].sortno
      this.form.orgId = this.orgData[index].orgId
      this.form.pId = this.orgData[index].parentId
      
      // console.log(this.form)
    },
    sendModify () {
      this.$refs.form1.validate((valid)=>{
          if(valid){
              this.modal1 = false
              let _this = this
              let obj = {
                orgName: this.form.orgName,
                orgId: this.form.orgId,
                parentId: this.form.pId,
                // contactsSyncRule:this.form.contactsSyncRule,
                // sortno: this.form.sort
              }
              saveOrg(obj)
                .then(function (res) {
                  if (res.data.code==0) {
                    _this.$emit('search', ['orgId', _this.orgId])
                    _this.$emit('updateTree')
                    _this.$Message.success(_this.$t('org_table_modify_ok'))
                    // 更新表格里的组织树
                  orgZTree({partyId:_this.mypartyId}).then(res=>{

                    _this.updateTreeList = res.data
                  })
                  }
                })
          }
      })
    },
    addOrg () {
      this.clearForm()
      this.form.parentName = this.orgMes.orgName
      this.form.pId = this.orgMes.orgId
      this.modal2 = true
    },
    sendAdd () {
      this.$refs.form2.validate((valid)=>{
          if(valid){
              this.modal2 = false
              let _this = this
              let obj = {
                orgName: this.form.orgName,
                parentId: this.form.pId,
              }
                saveOrg(obj)
                .then(function (res) {
                  if (res.data.code==0) {
                    _this.$Message.success(_this.$t('org_table_add_ok'))
                    // 更新表格里的组织树
                  orgZTree({partyId:_this.mypartyId}).then(res=>{
                    _this.updateTreeList = res.data
                  })
                    // console.log(_this.orgId)
                    _this.$emit('search')
                    _this.$emit('updateTree')
                  }
                })
          }
      })
     
    },
    changeOrg (arr) {
      this.show = false
      this.form.parentName = arr.orgName
      this.form.pId = arr.orgId
    },
    _deleteOrg () {
      let index = this.DeleteIndex
      let _this = this
      let id = this.orgData[index].orgId
      delOrg({'orgId': id})
        .then(function (res) {
          if (res.data.code==0) {
            _this.modal3 = false
            _this.$Message.success(_this.$t('org_table_delete_ok'))
            if(id = _this.orgId){
              _this.$emit('search')
            }else{
              _this.$emit('search', ['orgId', _this.orgId])
            }
            // 更新表格里的组织树

            orgZTree({partyId:_this.mypartyId}).then(res=>{
              _this.updateTreeList = res.data
            })
            _this.$emit('updateTree')
          }
        })
    },
    clearForm () {
      this.form.orgName = ''
      this.form.contactsSyncRule = 1
      // this.form.sort = 0,
      this.form.parentName = ''
      this.form.orgId = 1
      this.form.pId = 1
    }

  },
  computed: {
    tableData: function () {
      return this.orgData
    },
    org_table_modal1_title: function () {
      return this.$t('org_table_modal1_title')
    },
    org_table_modal1_orgName_label: function () {
      return this.$t('org_table_modal1_orgName_label')
    },
    org_table_modal1_state_label: function () {
      return this.$t('org_table_modal1_state_label')
    },
    org_table_modal1_sort_label: function () {
      return this.$t('org_table_modal1_sort_label')
    },
    org_table_modal2_title: function () {
      return this.$t('org_table_addOrg_btn')
    },
    org_table_modal2_orgName_placeholder: function () {
      return this.$t('org_table_modal2_orgName_placeholder')
    },
    org_table_modal2_parentOrg_label: function () {
      return this.$t('org_table_modal2_parentOrg_label')
    },
    org_table_modal2_parentOrg_placeholder: function () {
      return this.$t('org_table_modal2_parentOrg_placeholder')
    },
    org_table_modal3_title: function () {
      return this.$t('org_table_modal3_title')
    }

  }
}
</script>
