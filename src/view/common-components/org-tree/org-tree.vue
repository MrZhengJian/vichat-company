<script type="text/javascript">
/* eslint-disable */
</script>
<!-- 用于 人员表 左侧组织树 和 组织表 左侧组织树-->
<!-- 与org-tree的唯一区别是 默认展开 及 expand=true  -->
<style rel="stylesheet" lang="less">
    .ivu-col .myTree{
    	background: #fff;

        box-shadow: 1px 1px 1px 1px rgba(100, 100, 100, 0.1);
    	padding:5px;
    	height:100%;
        overflow-y:auto;
        overflow-x:hidden;
    }
    .myTree li ul{
        overflow:hidden;
        padding: 0 0 0 10px
    }
    .myTree ul li{
        margin:4px 0
    }
    .ivu-tree-title{
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>

<template>
    <Tree class="myTree" @on-select-change="orgSearch" :data="treeList"></Tree>
</template>

<script type="ecmascript-6">
import { orgZTree } from '@/api/user-manage'

export default {
	props:{
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
			treeList:[],
            expand:true,
            orgId:'',
            param:''
		}
	},
	created:function(){
		this._getMes()
	},
	methods:{
		orgSearch(arr){
            if(arr.length!=0){
                this.orgId=arr[0].id
                this.param = ["orgId",this.orgId,{"orgId":this.orgId,"orgName":arr[0].title}]
            }
            
            if(this.origin=='user'){
                this.$emit('searchuser',this.param)
            }else if(this.origin=='org'){
                this.$emit('searchorg',this.param)
            }else{
                this.$emit('search',this.param)
            }
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
                let param = {
                    'orgName':_this.treeList[0].title,
                    'orgId':_this.treeList[0].id
                }
                _this.$emit('defaultOrg',param)
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


