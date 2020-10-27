<template>
    <el-row class="demo-autocomplete" style="margin-top: 50px">
        <el-col :span="24">
            <el-input placeholder="请输入内容" v-model="telphone" style="max-width: 600px">
                <template slot="prepend">中国</template>
                <el-button slot="append" @click="sendcode()">发送验证码</el-button>
            </el-input>
        </el-col>
        <el-col :span="24" style="margin-top: 15px">
            <el-input placeholder="请输入验证码" v-model="code" style="max-width: 600px">
            </el-input>
        </el-col>
        <el-col :span="24" style="margin-top: 15px;">
            <el-button @click="login()" style="max-width: 600px;width: 100%" type="primary" plain>登录</el-button>
            <p class="attention">
                注册/登录 即代表同意
                <a href="https://xueqiu.com/about/terms" target="_blank" >服务协议</a>
                &
                <a href="https://xueqiu.com/law/privacy" target="_blank">隐私政策</a>
            </p>
        </el-col>
    </el-row>

</template>

<script>
    export default {
        name: "login",
        data(){
            return{
                telphone:'',
                code:'',
            }
        },
        methods:{
            sendcode(){
               this.axios.post('/sendcode',{
                   tel:this.telphone
               }).then(res=>{
                   console.log(res.data)
                   if(res.data.success==true){
                       alert('发送成功')
                   }else {
                       alert('发送失败')
                   }
               })
            },
            login(){
                const that = this;
                this.axios.post('/login',{
                    tel:this.telphone,
                    code:this.code
                }).then(res=>{
                    console.log(res)
                    if(res.data.success==true){
                        alert('登陆成功')
                        that.$router.push('/newIndex/datashow')
                    }else {
                        alert('登陆失败')
                    }
                })
            }
        }
    }
</script>

<style scoped>
.attention{
    margin-top: 10px;
    font-size: 12px;
    color: #8c939d;
}
</style>
