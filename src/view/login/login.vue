<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
   
    <div class="login-con">
      
      <Card icon="log-in" :title="login_welcome" :bordered="false">
        <div class="form-con">
          <login-form ref='login_form' @on-success-valid="handleSubmit"></login-form>
        </div>
      </Card>
      <div class="lang">
        <language @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"/>
      </div>
    </div>

  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapMutations,mapActions } from 'vuex'
import { loadSysStaticData } from '@/api/user-manage'
import { platForm } from '@/api/user'
import Language from '@/view/main/components/language'
export default {
  components: {
    LoginForm,
    Language
  },
  created () {
    platForm().then(res => {
      for(let key in res.data.obj){
        localStorage.setItem(key,res.data.obj[key])
      }
    })
    this.setLocal(this.$i18n.locale)
  },
  mounted(){
    this.$refs.login_form.refreshImg()
  },
  methods: {
    ...mapMutations([
      'setLocal'
    ]),
    ...mapActions([
      'handleLogin',
      'getUserInfo',
      'saveUserObj',
      'loadSysStaticData'
    ]),
   
    handleSubmit ({ userName, password, code }) {
      this.handleLogin({ userName, password, code }).then(res => {
        if(res.code!=0){
          this.$refs.login_form.refreshImg()
          return
        }
        this.$store.commit('clearTagNavList')
        this.getUserInfo().then(res => {
          this.$router.push({
            name: 'home'
          })
        })
      })
    }
  },
  computed:{
    login_welcome: function () {
      return this.$t('login_welcome')
    },
    local () {
      return this.$store.state.app.local
    }
  }
}
</script>

<style>

</style>
