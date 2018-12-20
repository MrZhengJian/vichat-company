<script type="text/javascript">
/* eslint-disable */
</script>
<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}" >
      <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList" @on-coll-change="handleCollapsedChange">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <h2 v-show="!collapsed"  key="max-logo" >{{maxLogo}}</h2>
          <h2 v-show="collapsed"  key="min-logo" >{{minLogo}}</h2>
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed">
          <user :user-avator="userName"/>
          <language @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"/>
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
          
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav ref="tagsNav" :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
          </div>
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view/>
            </keep-alive>
          </Content>
        </Layout>
      </Content>
    </Layout>
    <Drawer
        :title="ownSpaceTitle"
        v-model="ownSpace"
        width="480"
        @on-visible-change=changeOwnSpace
        :styles="styles"
    >
        <Form ref='formCustom' :model="formData" :rules="ruleCustom" :label-width="80">
            <Row :gutter="32">
                <Col span="24">
                    <FormItem :label="account" label-position="top"  prop="terminal">
                        <Input disabled v-model="formData.terminal" :maxlength='20'  style="width:300px;"/>
                    </FormItem>
                </Col>
                <Col span="24">
                    <FormItem :label="name" label-position="top" prop="userName">
                        <Input v-model="formData.userName"  :maxlength='20' style="width:300px;"/>
                    </FormItem>
                </Col>
                <Col span="24">
                    <FormItem :label="usertype" label-position="top" prop="type">
                        <Select disabled v-model="formData.userType" style="width:300px" >
                            <Option  :value="1" :key="1">{{ $t('employee_type_List1') }}</Option>
                            <Option  :value="2" :key="2">{{ $t('employee_type_List2') }}</Option>
                            <Option  :value="3" :key="3">{{ $t('employee_type_List3') }}</Option>
                            <Option  :value="4" :key="4">{{ $t('employee_type_List4') }}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="24">
                    <FormItem :label="phone" label-position="top" >
                        <Input v-model="formData.phone" :maxlength='30' style="width:300px;"/>
                    </FormItem>
                </Col>
                <Col span="24">
                    <FormItem :label="sex" label-position="top" >
                        <RadioGroup v-model="formData.sex">
                            <Radio :label="1">{{$t('user_table_modal1_gender_man')}}</Radio>
                            <Radio :label="2">{{$t('user_table_modal1_gender_woman')}}</Radio>
                            <Radio :label="3">{{$t('user_table_modal1_gender_secrecy')}}</Radio>
                        </RadioGroup>
                    </FormItem>
                </Col>
                
            </Row>
            
        </Form>
        <div class="demo-drawer-footer" style="padding-left:80px;">
            <Button style="margin-right: 8px" @click="$store.commit('setOwnSpace',false)">{{$t('cancel')}}</Button>
            <Button type="primary" @click="sendModify">{{$t('submit')}}</Button>
        </div>
    </Drawer>
    <Drawer
        :title="chgPwdTitle"
        v-model="chgPwd"
        width="480"
        @on-visible-change=changeChgPwd
        :styles="styles"
    >
        <Form ref='pwdFormData' :model="pwdFormData" :rules="ruleCustom" :label-width="80">
            <Row :gutter="32">
                <Col span="24">
                    <FormItem :label="pwd" prop="password">
                        <Input type="password" v-model="pwdFormData.password"  :maxlength='16' style="width: 300px" ></Input>
                    </FormItem>
                </Col>
                <Col span="24">
                    <FormItem :label="repeat" prop="repassword">
                        <Input type="password" v-model="pwdFormData.repassword" :maxlength='16' style="width: 300px" ></Input>
                    </FormItem>
                </Col>
            </Row>
            
        </Form>
        <div class="demo-drawer-footer" style="padding-left:80px;">
            <Button style="margin-right: 8px" @click="$store.commit('setChgPwd',false)">{{$t('cancel')}}</Button>
            <Button type="primary" @click="sendNewpwd">{{$t('submit')}}</Button>
        </div>
    </Drawer>      
  </Layout>
</template>
<script>

import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import { mapMutations, mapActions } from 'vuex'
import { getNewTagList, getNextRoute, routeEqual } from '@/libs/util'
import { saveEdposUser, chgUserPassword } from '@/api/user-manage'
import './main.less'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    User
  },
  data () {
    const validateAccount = (rule, value, callback) => {
        value = value.trim()
        if (value === '') {
            callback(new Error(this.$t('user_table_account_rules')));
        } else if (value.length>20) {
            callback(new Error(this.$t('max_len_rules')));
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback(new Error(this.$t('account_reg_error')));
        } else {
            callback();
        }
    };
    const validatePassword = (rule, value, callback) => {
        value = value.trim()
        if (value === '') {
            callback(new Error(this.$t('login_pwd_rules')));
        } else if (value.length>18 || value.length<6) {
            callback(new Error(this.$t('pwd_len_rules')));
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback(new Error(this.$t('account_reg_error')));
        } else {
            callback();
        }
    };
    const validateRepassword = (rule, value, callback) => {
        value = value.trim()
        if (value === '') {
            callback(new Error(this.$t('login_pwd_rules')));
        } else if (value.length>18 || value.length<6) {
            callback(new Error(this.$t('pwd_len_rules')));
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback(new Error(this.$t('account_reg_error')));
        } else if ( value !== this.pwdFormData.password){
            callback(new Error(this.$t('register_password_repeat')));
        }else {
            callback();
        }
    };
    const validateUserName = (rule, value, callback) => {
        value = value.trim()
        if (value === '') {
            callback(new Error(this.$t('user_table_userName_rules')));
        } else if (value.length>20) {
            callback(new Error(this.$t('max_len_rules')));
        } else {
            callback();
        }
    };
    return {
      collapsed: false,
      isFullscreen: false,
      
      menuList:this.$store.getters.menuList,
      minLogo:localStorage.getItem('platformNameShort'),
      maxLogo:localStorage.getItem('platformNameLong'),

      ruleCustom: {
            terminal: [
                {validator: validateAccount, trigger: 'blur'}
            ],
            password: [
                {validator: validatePassword, trigger: 'blur'}
            ],
            repassword:[
                {validator: validateRepassword, trigger: 'blur'}
            ],
            userName: [
                {validator: validateUserName, trigger: 'blur'}
            ],
            email: [
                { type: 'email', message: this.$t('user_table_email_rules'), trigger: 'blur' }
            ],
            loc: [],
            locTime: []
      },
      styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
      },
      formData: {
          uid: this.$store.state.user.userObj.uid,
          userName: this.$store.state.user.userObj.userName,
          phone: this.$store.state.user.userObj.phone,
          terminal: this.$store.state.user.userObj.terminal,
          userType: this.$store.state.user.userObj.userType,
          sex: this.$store.state.user.userObj.sex
      },
      pwdFormData: { // 修改密码时
          password: '',
          repassword: '',
          uid: this.$store.state.user.userObj.uid
      },
      ownSpaceTitle:this.$t('ownSpace'),
      name:this.$t('user_table_modal1_userName_label'),
      phone:this.$t('phone'),
      account:this.$t('user_table_modal1_account_label'),
      usertype:this.$t('user_table_modal1_userType_label'),
      sex:this.$t('user_table_modal1_gender_label'),
      chgPwdTitle:this.$t('user_table_modal6_title'),
      pwd:this.$t('user_table_modal6_newPwd_label'),
      repeat:this.$t('repeat'),
      
    }
  },
  created(){
    
  },
  computed: {
    ownSpace(){
        return this.$store.state.app.ownSpace
    },
    chgPwd(){
        return this.$store.state.app.chgPwd
    },
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userName () {
      return this.$store.state.user.userObj.userName
    },
    cacheList () {
      return this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []
    },
    local () {
      return this.$store.state.app.local
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal'
    ]),
    ...mapActions([
      'getUserInfo',
      'handleLogin'
    ]),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, route) {
      let openName = ''
      if (type === 'all') {
        this.turnToPage('home')
        openName = 'home'
      } else if (routeEqual(this.$route, route)) {
        if (type === 'others') {
          openName = route.name
        } else {
          const nextRoute = getNextRoute(this.tagNavList, route)
          this.$router.push(nextRoute)
          openName = nextRoute.name
        }
      }
      this.setTagNavList(res)
      this.$refs.sideMenu.updateOpenName(openName)
    },
    handleClick (item) {
      this.turnToPage(item)
    },
    changeOwnSpace(value){
        this.$store.commit('setOwnSpace',value)
        this.refreshFormData()
        this.$refs.formCustom.validate((valid)=>{})
        
    },
    changeChgPwd(value){
        this.$store.commit('setChgPwd',value)
    },
    sendModify () {
      let _this = this
      this.params = this.formData
      this.$refs.formCustom.validate((valid)=>{
        if(valid){
            saveEdposUser(this.params)
            .then(function (res) {
              if (res.data.code==0) {
                // 重新查找数据
                _this.$Message.success(_this.$t('user_table_modify_ok'))
                _this.$emit('search')
                _this.$store.commit('setOwnSpace',false)
                _this.getUserInfo().then(res=>{
                    _this.refreshFormData()
                })
              }
            })
        }
      })
      
    },
    sendNewpwd () {
      const _this = this
      this.$refs.pwdFormData.validate((valid) => {
        if(valid){
            chgUserPassword(this.pwdFormData)
            .then(function (res) {
                if (res.data.code==0) {
                  _this.$Message.success(_this.$t('user_table_modify_ok'))
                  _this.$store.commit('setChgPwd',false)
                } else {
                  _this.$Message.error(res.data.msg)
                }
            })
        }
      })
    },
    refreshFormData(){
      this.formData = {
            uid: this.$store.state.user.userObj.uid,
            userName: this.$store.state.user.userObj.userName,
            phone: this.$store.state.user.userObj.phone,
            terminal: this.$store.state.user.userObj.terminal,
            userType: this.$store.state.user.userObj.userType,
            sex: this.$store.state.user.userObj.sex
        }
    },
    refreshPwdFormData(){
        this.pwdFormData = {
            uid: this.$store.state.user.userObj.uid,
            password: '',
            repassword: '',
        }
    }
  },
  watch: {
    '$route' (newRoute) {
      
      this.setBreadCrumb(newRoute.matched)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.addTag({
      route: this.$store.state.app.homeRoute
    })
    this.setBreadCrumb(this.$route.matched)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    // this.minLogo = localStorage.getItem('platformNameShort')
    this.minLogo = localStorage.getItem('platformNameShort')
    this.maxLogo = localStorage.getItem('platformNameLong')
  }
}
</script>
