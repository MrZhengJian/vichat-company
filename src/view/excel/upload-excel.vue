<style lang="less">
  @import "./common.less";
</style>
<template>
  <div class="uploadExcel" style="min-height:100px;">
      <Row>
        <Upload action="" :before-upload="handleBeforeUpload" accept=".xls, .xlsx">
          <Button icon="ios-cloud-upload-outline" :loading="uploadLoading" @click="handleUploadFile">{{$t('upload')}}</Button>
        </Upload>
      </Row>
      <Row>
        <div class="ivu-upload-list-file" v-if="file !== null">
          <Icon type="ios-stats"></Icon>
            {{ file.name }}
          <Icon v-show="showRemoveFile" type="ios-close" class="ivu-upload-list-remove" @click.native="handleRemove()"></Icon>
        </div>
      </Row>
      <Row>
        <transition name="fade">
          <Progress v-if="showProgress" :percent="progressPercent" :stroke-width="2">
            <div v-if="progressPercent == 100">
              <Icon type="ios-checkmark-circle"></Icon>
              <span>{{$t('success')}}</span>
            </div>
          </Progress>
        </transition>
      </Row>
    <Row class="margin-top-10 utable">
      <Table stripe :columns="tableTitle" :data="tableData" :loading="tableLoading"></Table>
    </Row>
  </div>
</template>
<script>
import excel from '@/libs/excel'
export default {
  name: 'upload-excel',
  data () {
    return {
      uploadLoading: false,
      progressPercent: 0,
      showProgress: false,
      showRemoveFile: false,
      file: null,
      tableData: [],
      tableTitle: [],
      tableLoading: false
    }
  },
  methods: {
    initUpload () {
      this.file = null
      this.showProgress = false
      this.loadingProgress = 0
      this.tableData = []
      this.tableTitle = []
    },
    handleUploadFile () {
      // this.initUpload()
    },
    handleRemove () {
      this.initUpload()
      this.$Message.info(this.$t('fileDeleted'))
    },
    handleBeforeUpload (file) {
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt === 'xlsx' || fileExt === 'xls') {
        this.readFile(file)
        this.file = file
      } else {
        this.$Notice.warning({
          title: this.$t('fileTypeErr'),
          desc: this.$t('file')+'：'+ file.name + this.$t('fileTypeErrMes')
        })
      }
      return false
    },
    // 读取文件
    readFile (file) {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadstart = e => {
        this.uploadLoading = true
        this.tableLoading = true
        this.showProgress = true
      }
      reader.onprogress = e => {
        this.progressPercent = Math.round(e.loaded / e.total * 100)
      }
      reader.onerror = e => {
        this.$Message.error(this.$t('fileReadErr'))
      }
      reader.onload = e => {
        this.$Message.info(this.$t('fileReadSuc'))
        const data = e.target.result
        const { header, results } = excel.read(data, 'array')
        const tableTitle = header.map(item => { return { title: item, key: item } })
        this.tableData = results
        this.tableTitle = tableTitle
        this.uploadLoading = false
        this.tableLoading = false
        this.showRemoveFile = true

        // console.log(this.tableData)
        let myTableData=[]
        for(let i=0;i<this.tableData.length;i++){
          let obj = {
            terminal:this.tableData[i].Account,
            orgName:this.tableData[i].OrgName,
            userName:this.tableData[i].UserName,
          }
          if(this.tableData[i].Phone){
            obj.phone = this.tableData[i].Phone
          }
          myTableData.push(obj)
        }
        this.$emit('uploadTableData',myTableData)
      }
    }
  },
  created () {

  },
  mounted () {

  }
}
</script>
