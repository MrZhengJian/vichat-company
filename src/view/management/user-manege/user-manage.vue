<style rel="stylesheet" lang="less">
    @import "./user-manage.less";
</style>
<template>
  	<Row :gutter="8" class="user-manage">
        <Col ref='col3' span="4">
           <Tree class="user-manage-tree" @on-select-change="orgSearch" :data="treeList"></Tree>
        </Col>
        <Col span="20">
        	<person-table v-on:search="search" :orgMes="orgMes" :personData="personData" :total="total"></person-table>
        </Col>
    </Row>
</template>
<script>

export default {
  components: {
    
  },
  data () {
  	return {

  	}
  },
  methods: {
    
    
  },
  computed:{

  },
  created (){

  },
  mounted (){

  }
}
</script>