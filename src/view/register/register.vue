<script type="text/javascript">
/* eslint-disable */
</script>
<style rel="stylesheet" lang="less" scope>
    @import './register.less';
</style>

<template>
	<div class="register">
        <Card :bordered="false">
             <p slot="title">
                <Icon type="log-in"></Icon>
                {{welcomeMes}}   
            </p>
            <Form :model="form" label-position="left" :rules="rules" ref="registerForm">
		        <FormItem prop="terminal">
	                <Input type="text" v-model="form.terminal" :maxlength="20" :placeholder="register_firm_account_placeholder">
	                    <span slot="prepend">
	                        <Icon :size="18" type="md-contacts"></Icon>
	                    </span>
	                </Input>
	            </FormItem>
	           
	            <FormItem prop="companyName">
	                <Input type="text" v-model="form.companyName" :maxlength="20" :placeholder="register_firm_name_placeholder">
	                    <span slot="prepend">
	                        <Icon :size="18" type="md-contacts"></Icon>
	                    </span>
	                </Input>
	            </FormItem>
	            <FormItem prop="phone">
	                <Input type="text" v-model="form.phone" :maxlength="20" :placeholder="register_tel_placeholder">
	                    <span slot="prepend">
	                        <Icon :size="18" type="ios-call"></Icon>
	                    </span>
	                </Input>
	            </FormItem>
		        <FormItem prop="password">
	                <Input type="password" v-model="form.password" :maxlength="16" :placeholder="register_pwd_placeholder">
	                    <span slot="prepend">
	                        <Icon :size="18" type="md-lock"></Icon>
	                    </span>
	                </Input>
	            </FormItem>

	            <FormItem prop="repassword">
	                <Input type="password" v-model="form.repassword" :maxlength="16" :placeholder="register_repeat_pwd_placeholder">
	                    <span slot="prepend">
	                        <Icon :size="18" type="md-lock"></Icon>
	                    </span>
	                </Input>
	            </FormItem>

	            <FormItem>
                    <Button @click="submit" type="primary" long>{{$t('register_register')}}</Button>
                </FormItem>
		    </Form>
		    <p class="form-footer"><span class="toLogin" @click="toLogin">{{$t('register_login')}}>></span></p>
        </Card>
	</div>
</template>

<script type="ecmascript-6">
import {registerCompany} from '@/api/register'

	const _this=this
    export default {
    	name: 'register',
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
	            } else if (value.length>16 || value.length<6) {
	                callback(new Error(this.$t('pwd_len_rules')));
	            } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
	                callback(new Error(this.$t('account_reg_error')));
	            } else {
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
	        	disabled:true,
	        	second:'60',
	        	timer:null,
	        	welcomeMes:this.$t('register_welcome'),
	            form: {
	            	terminal:'',
	                phone: '',
	                userNumber:'',
	                password: '',
	                repassword: '',                
	                userName: '',
	                companyName:''
	            },
	            rules: {
	                phone: [
	                    { required: true, message: this.$t('register_tel_rules1'), trigger: 'blur' },
	                    { max: 20, message: this.$t('max_len_rules'), trigger: 'blur' }
	                ],
	                password: [
	                    {required: true,validator: validatePassword, trigger: 'blur'}
	                ],
	                repassword:[
	                    {required: true,validator: validatePassword, trigger: 'blur'}
	                ],
	                terminal:[
						{required: true,validator: validateAccount, trigger: 'blur'}
	                ],
	                companyName:[
						{required: true,validator: validateUserName, trigger: 'blur'}
	                ]
	                
	            }
	        };
    	},
    	created:function(){
    	
    	},
    	computed:{
    		text: function () {
                return this.timer ? this.second + this.$t('register_recapture') : this.$t('register_get_code');
            },
            register_tel_placeholder:function(){
            	return this.$t('register_tel_placeholder')
            },
            register_pwd_placeholder:function(){
            	return this.$t('register_pwd_placeholder')
            },
            register_repeat_pwd_placeholder:function(){
            	return this.$t('register_repeat_pwd_placeholder')
            },
            register_code_placeholder:function(){
            	return this.$t('register_code_placeholder')
            },
            register_firm_name_placeholder:function(){
            	return this.$t('register_firm_name_placeholder')
            },
            register_userName_placeholder:function(){
            	return this.$t('register_userName_placeholder')
            },
            register_email_placeholder:function(){
            	return this.$t('register_email_placeholder')
            },
            register_firm_account_placeholder:function(){
            	return this.$t('register_firm_account_placeholder')
            },
            repeat: function () {
	          return this.$t('repeat')
	        },
	        register_repeat_pwd_placeholder: function () {
	          return this.$t('register_repeat_pwd_placeholder')
	        },
    	},
    	methods:{
    		toLogin(){
	            this.$router.push({
	                name:'login'
	            });
	        },
			submit(){
				
				this.$refs.registerForm.validate((valid) => {
                    if (valid) {
                    	if(this.form.password!=this.form.repassword){
                    		this.$Message.error(this.$t('register_password_repeat'))
                    		return
                    	}
                    	delete this.form.repassword;
                    	this.form.userNumber = this.form.terminal
                    	this.form.userName = this.form.companyName
                        registerCompany(this.form).then(res=>{

            				if(res.data.code==0){
	                        	this.$router.push({
					                name:'login'
					            });
            				}
                        	
                        })
                        this.form.repassword = this.form.password
                    }
                })

			} 
    	}
    }
</script>

