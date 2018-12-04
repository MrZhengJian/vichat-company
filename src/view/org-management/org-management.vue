<script type="text/javascript">
/* eslint-disable */
</script>
<style rel="stylesheet" lang="less">
    @import "./org-management.less";
    @import "../../styles/common.less";
</style>

<template>
    <Row :gutter="8">
        <Col ref='col3' span="4">
            <Spin fix size="large" v-show="spin2"></Spin>
            <!-- 向子组件传值，:aaa="1"传递的是数字1   aaa="1"传递的是字符串1 -->
        	<org-tree v-on:search="search" @defaultOrg="defaultOrg" origin="org" :updateTreeList="updateTreeList"></org-tree>
        </Col>
        <Col span="20">
            <Spin fix size="large" v-show="spin1"></Spin>
        	<org-table v-on:search="search" :orgMes="orgMes" :orgId="orgId" v-on:updateTree="updateTree" :orgData="orgData"></org-table>
        </Col>
    </Row>
</template>

<script type="ecmascript-6">
import orgTable from '@/view/common-components/org-table/org-table'
import orgTree from '@/view/common-components/org-tree/org-tree'
import { orgZTree } from '@/api/user-manage'
import { queryEdposOrgByParentId } from '@/api/org-manage'

export default {
    components:{
        orgTree,
        orgTable
    },
    data () {
    	return{
            orgData:[],
            updateTreeList:[],
            updateTreeUrl:'/wvapi/orgZTree',
            searchOrgUrl:'/wvapi/queryEdposOrgByParentId',
            searchParams:{
               parentId:0
            },
            orgId:0,
            orgMes:{},
            spin1:false,
            spin2:false,
    	}
    },
    created:function(){
        // window.document.title = localStorage.getItem('platformNameLong')
    },
    methods:{
        search(arr){
            this.spin1 = true
            let _this = this
            if(arr){
                if(arr.length>2){
                    this.orgMes = arr[2]
                }
                
                this.searchParams.parentId = arr[1]
                this.orgId = arr[1]
            }else{
                this.searchParams.parentId = 0
            }
            queryEdposOrgByParentId(this.searchParams)
            .then(function(res){
                if(res.data.code&&res.data.code==-1){
                    _this.$router.push({
                        name:'login'
                    });
                }
                _this.orgData = res.data.rows
                _this.spin1 = false
            })
        },
        updateTree(){
            this.spin2 = true
            const _this = this
            orgZTree()
            .then(function(res){
               _this.updateTreeList = res.data
               _this.spin2 = false
            })
        },
        defaultOrg(obj){
            this.orgMes = obj
        }
    }
}    
</script>
