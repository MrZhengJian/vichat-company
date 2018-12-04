<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" :maxlength="20" :placeholder="login_user_placeholder">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" :maxlength="16" :placeholder="login_pwd_placeholder">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="code" class="code">
      <Input style="width:50%" type="text" :maxlength="4" v-model="form.code" :placeholder="register_code_placeholder">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
      <img @click="refreshImg" :title="login_verification_img_title" class="code_img" :src="imgSrc">
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>{{$t("login_btn")}}</Button>
    </FormItem>

    <a v-if="showRegister=='true'" @click="toRegister" style="position:absolute;bottom:8px;right:16px;font-size:12px">{{$t('login_toRegister')}}>></a>
  </Form>
</template>
<script>
import { platForm } from '@/api/user'
export default {
  name: 'LoginForm',
  data () {
    const validateAccount = (rule, value, callback) => {
        if (value == '') {
            callback(new Error(this.$t('user_table_account_rules')));
        } else if (value.length>20) {
            callback(new Error(this.$t('max_len_rules')));
        } else {
            callback();
        }
    };
    const validatePassword = (rule, value, callback) => {
        if (value == '') {
            callback(new Error(this.$t('login_pwd_rules')));
        } else if (value.length>16 || value.length<6) {
            callback(new Error(this.$t('pwd_len_rules')));
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback(new Error(this.$t('account_reg_error')));
        } else {
            callback();
        }
    };
    return {
      form: {
        userName: '',
        password: '',
        code: ''
      },
      imgSrc:'/vc/captcha',
      showRegister:true,
      rules:{
        userName: [
          {required: true,validator: validateAccount, trigger: 'blur'}
        ],
        password: [
          {required: true,validator: validatePassword, trigger: 'blur'}
        ],
        code: [
          { required: true, message: this.$t('login_code_rules1'), trigger: 'blur' },
          { type:'string', pattern: /^([a-z]|[A-Z]|[0-9]){4}$/, message: this.$t('login_code_rules2'), trigger: 'blur'}
        ]
      }
    }
  },
  created(){
    platForm().then(res=>{
      for(let key in res.data.obj){
        localStorage.setItem(key,res.data.obj[key])
      }
      this.showRegister = localStorage.getItem('showRegister')
    })
    this.form.userName = localStorage.getItem('login_account') || ''
  },
  computed: {
   
    login_user_placeholder: function () {
      return this.$t('login_user_placeholder')
    },
    login_pwd_placeholder: function () {
      return this.$t('login_pwd_placeholder')
    },
    login_verification_img_title: function () {
      return this.$t('login_verification_img_title')
    },
    register_code_placeholder: function () {
      return this.$t('register_code_placeholder')
    }
    
  },
  methods: {
    handleSubmit () {
      
      localStorage.setItem('login_account',this.form.userName)
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password,
            code: this.form.code
          })
        }
      })
    },
    refreshImg () {
       let ts = new Date().getTime()
       this.imgSrc='/vc/captcha?'+ts
    },
    toRegister(){
      this.$router.push({
        name: 'register'
      })
    }
  }
}
</script>
