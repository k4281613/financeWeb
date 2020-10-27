<template>
    <div>
        <h2>雪球活跃用户</h2>
        <el-divider><i class="el-icon-message-solid"></i></el-divider>
        <div v-loading="Loading"
             element-loading-text="拼命加载数据中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="#E9EEF3" style="z-index: 1">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane :name="(index+'')" v-for="(item,index) in list" :key="index" class="counselor_list">
                    <span slot="label">{{item.name}}</span>
                </el-tab-pane>
            </el-tabs>
            <div class="people_wrapper">
                <div class="people_list head-list">
                    <div class="hd">
                        <h3 class="title">{{category}}</h3>
                    </div>
                    <el-divider></el-divider>
                    <div class="bd">
                        <div class="bd_context" v-for="(item,index) in users" :key="index">
                            <div class="block" style="width: 60px">
                                <el-avatar shape="square" :size="50" :src="item.profile_image_url"></el-avatar>
                            </div>
                            <div style="width: 110px">
                                <span>
                                    <el-link type="primary" :href="item.profile" target="_blank">{{item.screen_name}}</el-link>
                                </span>
                                <p>{{item.description}}{{item.verified_description}}</p>
                            </div>
                        </div>
                    </div>
                    <!--                <p style="text-align: right">-->
                    <!--                    <el-link  target="_blank">更多>></el-link>-->
                    <!--                </p>-->
                    <el-divider></el-divider>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "counselor",
        data() {
            return {
                list: [
                    // {id: 0, name: '全部', order_id: 0, category: 0}
                ],
                activeName: '0',
                users: [],
                category: '',
                Loading: true
            }
        },
        methods: {
            handleClick(value) {
                console.log(value.index);
                const id = this.list[value.index].id;
                this.category = this.list[value.index].name;
                this.axios.post('/postcounselor', {
                    id: id
                }).then(res => {
                    console.log(res.data)
                    this.users = res.data;
                })
            },
            getList() {
                this.axios.get('/getcounselorList').then(res => {
                    console.log(res.data);
                    this.list = [...this.list, ...res.data];
                    this.Loading = false;
                });
            }
        },
        mounted() {
            this.getList();
            this.category = '人气用户';
            this.axios.post('/postcounselor', {
                id: 100
            }).then(res => {
                console.log(res.data)
                this.users = res.data;
            })
        }
    }
</script>

<style>
    .people_list .hd {
        height: 30px;
        line-height: 30px;
        padding-right: 12px;
        overflow: hidden;
        zoom: 1;
        color: black;
        text-align: left;
    }

    .people_list .bd {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
    }

    .people_list .bd .bd_context {
        width: 180px;
        height: 80px;
        display: flex;
        justify-content: flex-start;
        text-align: left;
        margin-bottom: 20px;
    }

    .bd_context div {
        padding-left: 10px;
        overflow: hidden;
    }

    .bd_context div span {
        font-size: 12px;
        line-height: 16px;
        max-width: 86px;
        overflow: hidden;
        display: block;
        height: 16px;
        text-overflow: ellipsis;
    }

    .bd_context div p {
        height: 50px;
        text-align: left;
        margin-top: 6px;
        line-height: 18px;
        color: #999;
        font-size: 11px;
        overflow: hidden;
    }

    .el-divider__text {
        background-color: #E9EEF3;
    }

    .counselor_list label {
        margin: 10px;
    }
</style>
