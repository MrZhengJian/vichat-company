<template>
    <div class="newfenceRules">
      <div class="ruleContent">
        <div class="time_rule">
            <div class="time_rule_left">
                <p>
                    <span>{{this.$t('rule')}}：</span>
                    <Select v-model="fenceMes.fenceType" style="width:300px">
                        <Option :value="1" :key="1">{{ $t('No_entry') }}</Option>
                        <Option :value="2" :key="2">{{ $t('Prohibit_going_out') }}</Option>
                    </Select>
                </p>
                <p>
                    <span>{{this.$t('condition')}}：</span>
                    <Select v-model="fenceMes.condition" style="width:300px">
                        <Option :value="1" :key="1">{{ $t('condition1') }}</Option>
                        <Option :value="2" :key="2">{{ $t('condition2') }}</Option>
                    </Select>
                </p>
                <p>
                    <span>{{this.$t('alarmLevel')}}：</span>
                    <Select v-model="fenceMes.alarmLevel" style="width:300px">
                        <Option :value="1" :key="1">{{ $t('alarmLevel1') }}</Option>
                        <Option :value="2" :key="2">{{ $t('alarmLevel2') }}</Option>
                    </Select>
                </p>
                <p>
                    <span>{{this.$t('time')}}：</span>
                    <TimePicker clearable v-model="timeRule.time" @on-ok="addTime" @on-clear="clearTimes" confirm format="HH:mm" type="timerange" placement="top-start" :placeholder="SelectTime" style="width: 300px"></TimePicker>
                </p>
                <div class="timeResult">
                    <div class="item" v-for="(item,index) in timeRule.times">
                        <span>{{item[0]+' - '+item[1]}}</span>
                        <Icon @click="deleteTimeItem(index)" type="md-close" />
                    </div>
                </div>
                <p>
                  <span>{{this.$t('home_echart_date')}}：</span>

                  <RadioGroup v-model="timeRule.type">
                      <Radio :label="3">{{$t('everyday')}}</Radio>
                      <Radio :label="1">{{$t('week')}}</Radio>
                      <Radio :label="2">{{$t('month')}}</Radio>
                  </RadioGroup>
                  <a v-if="timeRule.type==2||timeRule.type==1" class="clearTimes" @click="clearDate">{{$t('clear')}}</a>
                </p>
                <div class="typeResult">
                    <div v-if="timeRule.type==1" class="weekItem">
                        <span v-for="(item,index) in weekList" v-bind:class="{'active':!item}"  @click='clickItem(weekList,index)'>{{$t('week'+(index+1))}}</span>
                    </div>
                    <div v-if="timeRule.type==2" class="weekItem" style="">
                        <span v-for="(item,index) in monthList" v-bind:class="{'active':!item}"  @click='clickItem(monthList,index)' style="padding:0;width: 38px;height: 32px;text-align: center;line-height: 32px;">{{index+1}}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>         
</template>

<script type="ecmascript-6">
import { dateFormat } from '@/libs/tools'
import "../../../styles/common.less";
export default {
  data () {
    let _this=this;
    return {
      
      fenceMes:{
        fenceName:'',
        fenceDesc:'',
        fenceType:1,
        regcoords:'',
        condition:1,
        alarmLevel:1
      },
      // rule
      tab:1,
      timeRule:{
        time:[],
        times:[],
        type:3,
        date:[]
      },
      weekList:[true,true,true,true,true,true,true],
      monthList:[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],

  
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
    // 规则
    ruleTabClick(n){
      this.tab = n
    },
    addTime(){
      if(this.timeRule.time[0]==''||this.timeRule.time[1]==''){return}
      this.timeRule.times.push(this.timeRule.time)
    },
    deleteTimeItem(index){
      this.timeRule.times.splice(index,1)
    },
    clickItem(arr,n){
      arr.splice(n,1,!arr[n])
    },
    clearTimes(){
      this.timeRule.time = []
      this.timeRule.times = []
    },
    clearDate(){
      let _this = this
      this.weekList.forEach((item,n)=>{
        if(!item){
          _this.weekList.splice(n,1,true)
        } 
      })
      this.monthList.forEach((item,n)=>{
        if(!item){
          _this.monthList.splice(n,1,true)
        } 
      })
    },
    sendRules(){
      this.$emit('getRules',this.timeRule,this.weekList,this.monthList,this.fenceMes)
    },
  },
  mounted: function () {
    window.document.title = localStorage.getItem('platformNameLong')
  }

}
</script>

<style rel="stylesheet" lang="less">
    .newfenceRules{
			position: relative;
			.ruleContent{
				width: 100%;
				height: 100%;
				border-top:none;
				&>div{
					width: 100%;
					height: 100%;
					padding:16px;
				}
				.time_rule{
					width: 100%;
					height: 100%;
					display: flex;
					overflow-y:auto; 
					.time_rule_left{
						width: 600px;
						height: 100%;
						margin:0 auto;
						
							&>p{
								width: 400px;
								margin: 0 auto;
                padding:15px;
                position: relative;
								&>span{
									margin-right:10px;
									height: 32PX;
									line-height: 32px;
									float: left;
									width: 60px;
									text-align: right
								}
								.ivu-radio-group{
									height: 32px;
									line-height: 31px;
									.ivu-radio-group-item{
										margin-right: 20px;
									}
                }
                .clearTimes{
                  position: absolute;
                  top: 22px;
                  right: 18px;
                }
							}
							.timeResult{
								padding-left:184px;
								.item{
									position: relative;
									display:inline-block;
									width: 120px;
									height: 32px;
									line-height: 32px;
									border-radius: 4px;
									padding-left:13px;
									background: #2d8cf0;
									color: #fff;
									margin-right: 10px;
									margin-bottom: 10px;
									cursor: pointer;
									.ivu-icon{
										// display: none;
										position: absolute;
										top:10px;
										right:10px;
									}
									&:hover{
										background: #5cadff;
									}
								}
							}
							.typeResult{
								padding-left:184px;
								.weekItem{
									span{
										font-size:12px; 
										display: inline-block;
										padding:7px 12px;
										border:1px solid #ddd;
										border-radius: 4px;
										margin-right:10px;
										margin-bottom:10px;
										cursor: pointer;
										&:hover{
											border-color:#5cadff;
											background: #5cadff;
											color:#fff	
										}
										&.active{
											border-color:#2d8cf0;
											background: #2d8cf0;
											color:#fff	
										}
									}
								}
							}
						
					}
				}
			}
		}
</style>
