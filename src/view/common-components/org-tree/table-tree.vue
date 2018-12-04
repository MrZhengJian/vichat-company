<script type="text/javascript">
/* eslint-disable */
</script>
<!-- 用于 人员表 改变组织 和 组织表 添加组织时选择父级组织-->
<!-- 与org-tree的唯一区别是 默认不展开 及 expand=false  -->
<style rel="stylesheet" lang="less">
    .ivu-col .tableTree{
    	background: #fff;
    	border:1px solid #ddd;
    	padding:5px 15px;
    	height:100%;
        overflow-y:auto;
    }
    .tableTree li ul{
        overflow:hidden;
        padding: 0 0 0 10px
    }
    .tableTree ul li{
        margin:4px 0
    }
</style>

<template>
    <Tree class="tableTree" @on-select-change="orgSearch" :data="treeList"></Tree>
</template>

<script type="ecmascript-6">
import { orgZTree } from '@/api/user-manage'

export default {
	props:{
		methodName:"",
        updateTreeList:{
        }
	},
    watch:{
        updateTreeList:function(){
            this.treeList=[]
            this.treeList=this.getTree(this.updateTreeList)
        }
    },
	data(){
		return{
			url:'/wvapi/orgZTree',
            // url:'/src/json/org-tree.json',
			treeList:[],
            expand:false,
            orgId:'',
            orgName:''
		}
	},
	created:function(){
		this._getMes()
	},
     computed:{
        userObj:function(){
            return this.$store.state.user.userObj
        }
    },
	methods:{

		orgSearch(arr){
            if(arr.length!=0){
                this.orgId=arr[0].id
                this.orgName=arr[0].title
            }
           
            let param = {
                 "orgId":this.orgId,
                 "orgName":this.orgName
             }   
            this.$emit('changeOrg',param)
		},
		_getMes(){
            const _this = this
            orgZTree()
            .then(function(res){
                if(res.data.code&&res.data.code==-1){
                    _this.$router.push({
                        name:'login'
                    });
                }
                _this.treeList = _this.getTree(res.data)
            })
        }, 
        //转化数据结构
        getTree(data){
            var sNodes = []
            var r = []
            var tmpMap = [];

            for(var x=0;x<data.length;x++){
                var obj = {
                    'title':data[x].name,
                    'id':data[x].id,
                    'pId':data[x].pId
                }
                sNodes.push(obj)
            }

            for (var i=0, l=sNodes.length; i<l; i++) {
                tmpMap[sNodes[i]['id']] = sNodes[i];
            }
            for (var i=0, l=sNodes.length; i<l; i++) {
                if (tmpMap[sNodes[i]['pId']] && sNodes[i]['id'] != sNodes[i]['pId']) {
                    if (!tmpMap[sNodes[i]['pId']]['children'])
                        tmpMap[sNodes[i]['pId']]['children'] = [];
                        tmpMap[sNodes[i]['pId']]['expand'] = this.expand;
                        tmpMap[sNodes[i]['pId']]['children'].push(sNodes[i]);
                    } else {
                    r.push(sNodes[i]);
                }
            }
            return r
        } 
	}
}
</script>

