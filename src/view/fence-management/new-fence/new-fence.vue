<template>
    <div class="new_fence">
        <div class="steps" style="padding-left:10%;margin:10px 0;">
          <Steps :current="step" size="small">
            <Step :title="newfenceName"></Step>
            <Step :title="newfenceArea"></Step>
            <Step :title="newfenceRules"></Step>
            <Step :title="newfenceUser"></Step>
            <Step :title="newfenceFinish"></Step>
          </Steps>
        </div>
        <Divider />
        <div class="content">
          <div class="newfenceName" v-if="step==0">
            <div class="nameContent">
              <p>
                <span>{{this.$t('name')}}：</span>
                <Input clearable v-model="fenceMes.fenceName" :max="100" :placeholder="fenceName_placeholder1" style="width:400px;"></Input>
              </p>
              <p>
                <span>{{this.$t('desc')}}：</span>
                <Input type='textarea' :autosize="{'minRows': 3,'maxRows': 5}" clearable v-model="fenceMes.fenceDesc" :max="100" :placeholder="fenceName_placeholder2" style="width:400px;"></Input>
              </p>
            </div>
          </div>    
          <keep-alive>
            <newfence-area  ref="newfenceArea" v-if="step==1" @getRegcoords="getRegcoords"></newfence-area>
          </keep-alive>
          <!-- 谷歌地图 -->
          <!-- <div class="newfenceArea" v-if="step==1">
            <div class="mapBtns">
              <Button type="primary" @click="gmapDrawPolygon">{{$t('drawPolygon')}}</Button>
              <Button type="error" @click="gmapDeletePolygon">{{$t('user_table_col_delete')}}</Button>
            </div>
            <gmap-map
                ref='gamp'
                :center="mapCenter"
                :zoom="15"
                style="width: 100%; height: 100%"
                >
                <gmap-polygon 
                  :paths=gmapPolygon.paths
                  :draggable="gmapPolygon.draggable" 
                  :editable="gmapPolygon.editable" 
                  :events="gmapPolygon.events"
                  :strokeColor="gmapPolygon.strokeColor"
                  :strokeWeight="gmapPolygon.strokeWeight"
                  :fillColor="gmapPolygon.fillColor"
                  :fillOpacity="gmapPolygon.fillOpacity"
                ></gmap-polygon>
            </gmap-map>
          </div>            -->
          <!-- rules -->
          <keep-alive>
            <newfence-rules  ref="newfenceRules" v-if="step==2" @getRules="getRules"></newfence-rules>
          </keep-alive>
          <!-- user -->
          <keep-alive>
            <newfence-user  ref="newfenceUsers" v-if="step==3" @getUsers="getUsers"></newfence-user>
          </keep-alive>
          <!-- finish -->    
          <div class="newfenceFinish" v-if="step==4">
              <div class="creating" v-if="!finished">
                <h1>{{$t('newfenceCreating')}}...</h1>
              </div>
              <div class="completed" v-if="finished">
                <h1>{{$t('newfenceCompleted')}}</h1>
                <p>{{$t('pleaseto')}}<span class="toDistrictFence" @click="toDistrictFence"> {{$t('district_fence')}} </span>{{$t('page')}}{{$t('channel_col_view')}} </p>
              </div>
          </div>      
        </div>
        <div class="footer">
            <Button type="default" v-if="step!=0" @click="changeStep(-1)">{{$t('prev')}}</Button>
            <Button type="primary" v-if="step!=4" @click="changeStep(1)">{{$t('next')}}</Button>
            <Button type="primary" v-if="step==4" @click="modal1=false">{{$t('finish')}}</Button>
        </div>
      </div>
      
</template>

<script type="ecmascript-6">
import newfenceArea from '@/view/fence-management/components/newfenceArea'
import newfenceRules from '@/view/fence-management/components/newfenceRules'
import newfenceUser from '@/view/fence-management/components/newfenceUser'
import { createFence } from '@/api/fence'
import { dateFormat } from '@/libs/tools'

export default {
  components: {
    newfenceArea,
    newfenceRules,
    newfenceUser
  },
  data () {
    let _this=this;
    return {
      partyId:this.$store.state.user.userObj.partyId,
      step:0,
      finished:false,
      spin: false,
      
      fenceMes:{
        fenceName:'',
        fenceDesc:'',
        fenceType:1,
        regcoords:'',
        condition:1,
        alarmLevel:1
      },

      // 高德参数
 

      // rule
      tab:1,
      timeRule:{
        time:[],
        times:[],
        type:3,
        date:[]
      },
      weekList:[],
      monthList:[],

      // user
      added: [],

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
    changeStep(n){
      if(n==1){
        // name
        if(this.step==0){
          if(this.fenceMes.fenceName==''){
            this.$Message.error(this.$t('fenceName_placeholder1'))
            return
          }
          if(this.fenceMes.fenceDesc==''){
            this.$Message.error(this.$t('fenceName_placeholder2'))
            return
          }
        }
        // map
        if(this.step==1){
          this.$refs.newfenceArea.sendRegcoords()
          if(this.fenceMes.regcoords.length==0){
            this.$Message.error(this.$t('fenceArea_placeholder'))
            return
          }
          // console.log(this.fenceMes.regcoords)
        }
        // rules
        if(this.step==2){
          this.$refs.newfenceRules.sendRules()
          if(this.timeRule.times.length==0){
            this.$Message.error(this.$t('select_time'))
            return
          }

          this.timeRule.date=[]
          let arr = []
          if(this.timeRule.type==1){
            arr = this.weekList
          }else if(this.timeRule.type==2){
            arr = this.monthList 
          }
          for(let i=0;i<arr.length;i++){
            if(!arr[i]){
              this.timeRule.date.push(i+1)
            }
          }

          if(this.timeRule.type!=3&&this.timeRule.date.length==0){
            this.$Message.error(this.$t('home_echart_select_date'))
            return
          }

          if(this.timeRule.type==3){
            this.timeRule.date=-1
          }
        }
        // users
        if(this.step==3){
          this.$refs.newfenceUsers.sendUsers()
          if(this.added.length==0){
            this.$Message.error(this.$t('fenceUser_placeholder'))
            return
          }
          this.createFence()
        }
      }
      if(this.step>=0){
         this.step+=n
      }
     
    },
    // 高德
    getRegcoords(arr){
      this.fenceMes.regcoords = arr
    }, 
    // 谷歌
    
    // 规则
    getRules(arr,weekList,monthList,fenceMes){
      this.timeRule = arr
      this.weekList = weekList
      this.monthList = monthList
      this.fenceMes.fenceType=fenceMes.fenceType
      this.fenceMes.condition=fenceMes.condition
      this.fenceMes.alarmLevel=fenceMes.alarmLevel
    }, 
    // user
    getUsers(arr){
      this.added = arr
    },

    createFence(){
      let data = {
        districtFence:{
          partyId:this.partyId,
          fenceName:this.fenceMes.fenceName,
          fenceDesc:this.fenceMes.fenceDesc,
          fenceType:this.fenceMes.fenceType,
          regcoords:this.fenceMes.regcoords
        },
        districtFenceUser:{
          ids:this.added,
          type:3,
        },
        districtFenceRule:{
          ruleCondition:this.fenceMes.condition,
          ruleJson:{
            ruleTime:this.timeRule.times,
            ruleDate:this.timeRule.date.join(','),
          },
          ruleType:this.timeRule.type,
          alarmLevel:this.fenceMes.alarmLevel
        }
      }
      createFence(data)
        .then(res=>{
          if(res.data.code==0){
            this.finished = true
          }
        })
      },
     
      toDistrictFence(){
        this.$router.push({
            name:'district_fence'
        });
      }


  },

  mounted: function () {
    window.document.title = localStorage.getItem('platformNameLong')
  }

}
</script>

<style rel="stylesheet" lang="less">
    @import "../../../styles/common.less";
    @import './new-fence.less';
</style>
