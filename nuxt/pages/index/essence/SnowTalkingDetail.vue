<template>
    <div v-loading="Loading"
         element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="#E9EEF3" class="snowtalkingdetail">
        <el-page-header @back="goBack"></el-page-header>
        <h2 v-if="!Loading">{{title}}</h2>
        <div style="text-align: right">
            <el-link :href="from" target="_blank">
                {{from}}
            </el-link>
        </div>
        <el-divider></el-divider>
        <div class="mycontext">
            <div class="introduction" >
            <el-row>
                <el-col :span="2" style="min-width: 60px">
                    <img :src="imgsrc" style="width: 52px;height: 52px">
                </el-col>
                <el-col :span="22">
                    <h3 style="font-size: 12px;text-align: left">
                        <label>嘉宾：{{guest}}</label>
                    </h3>
                    <p style="font-size: 12px;text-indent: 1.5rem;text-align: left" v-html="description"></p>
                    <p style="font-size: 12px;color: #7F828B;margin-top: 5px">
                        <label style="float: right">{{interview_time}}</label>
                    </p>
                </el-col>
            </el-row>
            </div>
            <el-divider></el-divider>
            <el-collapse v-model="activeNames" class="snowtalkingdetail" style="width: 100%">
                <el-collapse-item :name="(index+'')" v-for="(item,index) in datas" :key="index" style="margin-bottom:1em ">
                    <template slot="title">
                        <div style="width: 100%;">
                            {{item.quester}}提问：
                            <div v-html="item.question" class="newtitle" ></div>
                            <h4 style="text-align: right">{{item.quest_timeBefore}}</h4>
                        </div>
                    </template>
                    <el-card shadow="never">
                        <p>{{item.answer}}回答：</p>
                        <div v-html="item.text" style="text-indent: 2rem"></div>
                        <h4 style="text-align: right">{{item.timeBefore}}</h4>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'SnowTalkingDetail',
        data() {
            return {
                title: '',
                from: '',
                Loading: true,
                description: '',
                imgsrc: '',
                guest: '',
                interview_time:'',
                activeNames: [],
                datas: []
            };
        },
        methods: {
            goBack(){
                this.$router.go(-1);//返回上一层
            }
        },
        mounted() {
            const interviewId = this.$route.query.interviewId;
            this.title = this.$route.query.title;
            this.axios.post(`/postOldSonwTaklingDetail`, {
                interviewId: interviewId
            }).then(res => {
                console.log(res.data)
                this.from = res.data.detail.from;
                this.description = res.data.topic.description;
                this.imgsrc = res.data.topic.imgsrc;
                this.guest = res.data.detail.user;
                this.interview_time= res.data.topic.interview_time;
                this.datas=res.data.detail.statuses;
                this.Loading = false
            })
        }
    }
</script>
<style>
    body {
        margin: 0;
    }
    .introduction{

    }
    .snowtalkingdetail .newtitle {
        max-height: 80px;
        overflow: hidden;
    }
    .snowtalkingdetail .el-collapse-item__content{
        background-color: #E9EEF3;
    }
    .snowtalkingdetail .el-collapse-item__header {
        height: 100px;
        padding: 10px;
        line-height: 20px;
        text-indent: 2em;;
        font-family: "PingFang SC";
        text-align: left;
        width: 100%;
        background-color: #E9EEF3;
        border: 1px solid gray;
    }

    .snowtalkingdetail .el-card__body {
        text-align: left;
        background-color: #E9EEF3;
    }

    .snowtalkingdetail .el-card__body > h2 {
        text-align: center;
    }
    .snowtalkingdetail {
        height: 100%;
    }

    .mycontext {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
    }
</style>
