<template>
    <!-- user -->
  <div class="newfenceUser">
    <Button type="primary" :disabled="refreshDisabled" @click="refresh" class="refresh">
        {{$t('channel_details_modal1_refresh')}}
    </Button>
    <div class="tree">
        <div class='selectOrg' >
            <span class="selectOrg-title">
                {{$t('channel_details_modal1_selectOrg_label')}}
            </span>
            <div class="selectOrg-content">
                <Input type="text" :readonly="true" :placeholder="channel_details_modal1_selectOrg_placeholder" @on-focus="showTree=true" v-model="orgName" style="width:300px;" ></Input>
            </div>
            
        </div>
        <org-tree v-show="showTree" v-on:changeOrg="changeOrg"></org-tree>
        
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
  </div> 

</template>

<script type="ecmascript-6">
import orgTree from '@/view/common-components/org-tree/table-tree'
import "../../../styles/common.less";
import { batchQueryUsers, queryEdposUsers } from '@/api/user-manage'
import { dateFormat } from '@/libs/tools'
export default {
  components: {
    orgTree
  },
  data () {
    let _this=this;
    return {
     
      
      // user
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
      // 穿梭框数据
      unadded: [],
      added: [],
      listStyle: {
        width: '344px',
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
      refreshDisabled: false,

      fenceName_placeholder:this.$t('fenceName_placeholder'),
      fenceName_placeholder1:this.$t('fenceName_placeholder1'),
      fenceName_placeholder2:this.$t('fenceName_placeholder2'),
      fenceType_placeholder:this.$t('fenceType_placeholder'),
      newFence:this.$t('newFence'),
      newfenceName:this.$t('newfenceName'),
      newfenceArea:this.$t('newfenceArea'),
      newfenceRules:this.$t('newfenceRules'),
      newfenceUser:this.$t('newfenceUser'),
      newfenceFinish:this.$t('newfenceFinish'),
      week:this.$t('week'),
      month:this.$t('month'),
      everyday:this.$t('everyday'),
      SelectTime:this.$t('select_time'),
    }
  },

  created: function () {
  },
  methods: {
    // user
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
        })
    },
    refresh(){
      this.orgName = ''
      this.unadded = []
      this.added = []
    },
    filterMethod (data, query) {
      data = data.label
      query = query.toLowerCase()
      return data.toLowerCase().indexOf(query) > -1
    },
    _onChange (targetKeys, direction, moveKeys) {
      this.added = targetKeys
    },
    onSelectedChange (sourceSelectedKeys, targetSelectedKeys) {
      this.leftSelected = sourceSelectedKeys
    },
    sendUsers(){
      this.$emit('getUsers',this.added)
    },
  },
  computed: {
    channel_details_modal1_selectOrg_placeholder: function () {
      return this.$t('channel_details_modal1_selectOrg_placeholder')
    },
  },
  mounted: function () {
    window.document.title = localStorage.getItem('platformNameLong')
  }

}
</script>

<style rel="stylesheet" lang="less">
   .newfenceUser{
			.refresh{
				float: right;
				position: relative;
				z-index: 100;
			}
			.tree{
				position: relative;
				
				.selectOrg{
					position: relative;
					margin-bottom: 10px;
					display: flex;			
				}
				.selectOrg .selectOrg-title,.selectOrg-content{
					float:none;
				}
				.selectOrg .selectOrg-title{
					display:inline-block;
					text-align: right;
					vertical-align: middle;
					font-size: 12px;
					color: #495060;
					line-height: 1;
					padding: 10px 12px 10px 0;
					box-sizing: border-box;
				}
				.ivu-tree{
					width: 300px;
					min-height: 18px;
					position: absolute;
					top: 36px;
					left: 138px;
					z-index: 100;
					background: #fff;
					border:1px solid #57A3F3;
					padding-left:5px;
					border-radius: 4px;
					overflow: auto;
					transition: all 0.5s linear;
				}
				
      }
      .transfer .ivu-transfer .ivu-transfer-operation button {
          width: 80px;
          text-align: center;
          padding: 5px 0;
      }
		}
</style>
