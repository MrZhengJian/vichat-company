<script type="text/javascript">
  /* eslint-disable */
</script>

<style lang="less">
    @import "../../../styles/common.less";
    @import "./home.less";    
</style>
<template>
    <div class="home-main" style="margin-bottom:30px;">
      
        <Row :gutter="10" style="margin-bottom:20px;">
            <Col :md="24" :lg="24">
                <Card class="homeTitle">
                    <Row :gutter="10" >
                        <Col :md="16" :lg="16" class="home-title-left">
                            <div class="home-title-avatar">
                              <Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar>  
                            </div>
                            <div  v-if="logoText" class="home-title-mes">
                                <h2><span style="font-weight:normal">{{$t('home_welcome')}}</span> {{logoText}}</h2>
                                <p>{{userName}}</p>
                            </div>
                        </Col>
                        <Col :md="8" :lg="8" class="home-title-right">
                            <div>
                                <p class="title">{{$t('home_employee')}}</p>
                                <p class="count">{{count.userCount}}</p>
                            </div>
                            <div class="border"></div>
                            <div>
                                <p class="title">{{$t('home_online')}}</p>
                                <p class="count">{{count.onlineCount}}</p>
                            </div>
                            <div class="border"></div>
                            <div>
                                <p class="title">{{$t('home_organize')}}</p>
                                <p class="count">{{count.orgCount}}</p>
                            </div>
                            <div class="border"></div>
                            <div>
                                <p class="title">{{$t('home_channel')}}</p>
                                <p class="count">{{count.channelCount}}</p>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Row v-if="channel_role" :gutter="10" style="margin-bottom:20px;">
            <Col :md="24" :lg="24">
                <Card class="channelList">
                    <p slot="title">
                       {{$t('home_channel_list')}}
                       <span @click="toChannelManage">{{$t('home_channel_list_more')}}</span> 
                    </p>
                    <Row :gutter="10" class="channelCard">
                        <Col :md="6" :lg="6" v-for="item in channelList">
                            <Card>
                                <div @click="toChannelDetails(item.rid,item.name)">
                                    <p class="title" :title="item.name">
                                       <span>{{item.name}}</span> <br>
                                       <span>({{item.style}})</span>
                                    </p>
                                    <p style="font-size:12px;">{{$t('employee_type_List2')}}：{{item.ownerName}}</p>
                                </div>
                                
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Row :gutter="10">
            <Col :md="24" :lg="24">
                <Card class="onLineCharts">
                    <p slot="title" class="card-title">
                        {{$t('home_rankings')}}
                        <Button type="text" @click="_openDetails">
                            {{$t('home_rankings_details')}}
                        </Button>
                        <Button type="text" v-bind:class="{ active: !active }" @click="_parent('1')">{{$t('home_rankings_month')}}</Button>
                        <Button type="text" v-bind:class="{ active: active }" @click="_parent('0')">{{$t('home_rankings_day')}}</Button>
                    </p>
                    <div class="data-source-row">
                        <visite-volume ref="child"></visite-volume>
                    </div>
                </Card>
            </Col>
        </Row>   
    </div>
</template>

<script>
import visiteVolume from './components/visiteVolume.vue';
import Cookies from 'js-cookie';
import { getCounts } from '@/api/home';
import { queryChannels } from '@/api/channel'
export default {
    name: 'home',
    created:function(){

        this.getCount()
        console.log(this.$store.state.user)
        let _this = this
        queryChannels({'page':1,'limit':4})
        .then(res=>{
            _this.channelList = _this._turnData(res.data.data)
        })
    },
    components: {
        visiteVolume
    },
    data () {
        return {
            getCountUrl:'/wvapi/getMainInfo',
            channelListUrl:'/wvapi/queryChannels',
            count: {
                userCount: 0,
                onlineCount: 0,
                orgCount: 0,
                channelCount: 0
            },
            showAddNewTodo: false,
            newToDoItemValue: '',
            active:true,
            logoText:this.$store.state.user.userPartyCompany.companyName,
            userName:this.$store.state.user.userObj.userName,
            channelList:[],
            channel_role:this.$store.state.app.channel_role
        };
    },
    computed: {
        avatorPath () {
            return localStorage.avatorImgPath;
        }
    },
    mounted:function(){
        if(this.$store.state.user.userOrg.parentId!=0){
            this.logoText+="【"+this.$store.state.user.userOrg.orgName+"】"
        }
    },
    methods: {
        _parent(n){
            this.active = n=='0'? true:false
            this.$refs.child.getChartData(n)
        },
        _openDetails(){
            this.$refs.child.openDetails()
            this.$refs.child._getLogDetails()
        },
        addNewToDoItem () {
            this.showAddNewTodo = true;
        },
        addNew () {
            if (this.newToDoItemValue.length !== 0) {
                this.toDoList.unshift({
                    title: this.newToDoItemValue
                });
                setTimeout(() => {
                    this.newToDoItemValue = '';
                }, 200);
                this.showAddNewTodo = false;
            } else {
                this.$Message.error('请输入待办事项内容');
            }
        },
        cancelAdd () {
            this.showAddNewTodo = false;
            this.newToDoItemValue = '';
        },
        getCount(){
            let _this = this 
            getCounts()
            .then(function(res){
                if(res.data.success){
                    _this.count.userCount= res.data.obj.userCount
                    _this.count.onlineCount= res.data.obj.onlineCount
                    _this.count.orgCount= res.data.obj.orgCount
                    _this.count.channelCount= res.data.obj.channelCount
                }
            })
        },
        toChannelManage(){
            this.$router.push({
                name:'channel'
            });
        },
        toChannelDetails(channelId,channelName){
            localStorage.setItem('channelDetailsChannelId',channelId)
            localStorage.setItem('channelDetailsChannelName',channelName)
            this.$router.push({
                name:'channel_details',
                params: { 
                    'rid': channelId,
                    'channelName':channelName
                }
            });
        },
        _turnData (arr) {
          // console.log(arr)
          for (let i = 0; i < arr.length; i++) {
            switch (arr[i].style) {
              case 1:arr[i].style = this.$t('Type_StyleId1'); break
              case 2:arr[i].style = this.$t('Type_StyleId2'); break
              case 3:arr[i].style = this.$t('Type_StyleId3'); break
              case 4:arr[i].style = this.$t('Type_StyleId4'); break
              case 5:arr[i].style = this.$t('Type_StyleId5'); break
            }
          }
          return arr
        },
        
    }
};
</script>
