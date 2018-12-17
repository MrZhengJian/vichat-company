<script type="text/javascript">
  /* eslint-disable */
</script>

<style rel="stylesheet" lang="less">
    @import "../../styles/common.less";
    @import "./user-management.less";
    
</style>

<template>
    <Row :gutter="8">
        <Col ref='col3' span="4">
        <Spin fix size="large" v-show="spin2"></Spin>
            <!-- 向子组件传值，:aaa="1"传递的是数字1   aaa="1"传递的是字符串1 -->
        	<org-tree v-on:search="search" @defaultOrg="defaultOrg" origin="user"></org-tree>
        </Col>
        <Col span="20">
            <Spin fix size="large" v-show="spin1"></Spin>
        	<person-table ref='ptable' v-on:search="search" :orgMes="orgMes" :newQuery="newQuery" :personData="personData" :total="total"></person-table>
        </Col>
    </Row>
</template>

<script type="ecmascript-6">
import personTable from '@/view/common-components/person-table/person-table'
import orgTree from '@/view/common-components/org-tree/org-tree'
import { queryEdposUsers } from '@/api/user-manage'

export default {
    components:{
        orgTree,
        personTable
    },
    data () {
    	return{
            personData:[],
            total:0,
            searchParams:{
                displayState: 99,
                orgId: 0,
                userName: '',
                page: 1,
                limit: 10,
            },
            orgMes:{},
            newQuery:false,
            spin1:false,
            spin2:false,
    	}
    },
    computed:{

    },
    created:function(){
    },
    methods:{
        search(arr,n){
            const _this = this
            _this.spin1 = true
            if(arr){
                if(arr.length >2 ){//只有点击组织树是length才会为3
                    this.orgMes = arr[2]
                }
                
                this.searchParams[arr[0]] = arr[1]
                if(arr[0]=='orgId'||arr[0]=='userName'||arr[0]=='userType')  this.searchParams.page = 1
            }
            queryEdposUsers(this.searchParams)
            .then(function(res){
                if(res.data.code&&res.data.code==-1){
                    _this.$router.push({
                        name:'login'
                    });
                }
                if(res.data.data.length==0&&n=='del'&&_this.searchParams.page>1){
                    _this.searchParams.page--
                    _this.search()
                }else{
                    _this.newQuery = true
                    _this.personData = res.data.data
                    _this.total = res.data.count
                    _this.spin1 = false
                }
                
            })
        },
        defaultOrg(obj){
            this.orgMes = obj
        }
    }
}
</script>

