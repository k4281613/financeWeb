<template>
    <div style="line-height: 20px">
        <div class="newTalking">
            <h3 style="text-align: left">最新访谈</h3>
            <el-divider></el-divider>
            <div class="noting" v-if="isnothing">
                <p style="color:#555;margin-bottom: 60px;margin-top: 15px;text-align: left">近期没有访谈，你可以查看过往的精彩回顾。</p>
            </div>
            <div class="SnowTalkingContainer">
                <div v-for="(item,index) in items" :key="index"
                     v-loading="fullscreenLoading"
                     element-loading-text="拼命加载数据中"
                     element-loading-spinner="el-icon-loading"
                     element-loading-background="#E9EEF3" >
                    <div class="SnowTalkingElcard">
                        <img :src="item.imgsrc" class="image">
                        <div style="width: 300px;min-height: 150px">
                            <el-link type="primary" :href="item.url"  target="_blank">
                                <h4>{{item.topic}}</h4>
                            </el-link>
                            <p style="font-size: 12px">
                                嘉宾：
                                <el-link type="primary" :href="item.guesturl" style="font-size: 12px"  target="_blank">{{item.guest}}
                                </el-link>
                            </p>
                            <span style="font-size: 12px">{{item.time}}</span>
                            <p style="font-size: 12px;text-indent: 1.5rem;text-align: left">{{item.description}}</p>
                            <!--                    <el-button type="text" class="button" @click="test()">操作按钮</el-button>-->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-divider></el-divider>
        <div class="oldTalking">
            <h3 style="text-align: left">精彩回顾</h3>
            <el-divider></el-divider>
            <ul v-loading="uLoading"
                element-loading-text="拼命加载数据中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="#E9EEF3"
                class="snowtalkingUL" style="z-index: 1">
                <li v-for="(item,index) in interviews" :key="index" style="text-align: left">
                    <el-link target="_blank" @click="gotodetail(item.interviewId,item.title)">{{item.title}}</el-link>
                    <label style="font-size: 10px">({{item.date}})</label>
                    <div style="line-height: 20px">
                    </div>
                </li>
            </ul>
            <div style="margin-top: 20px;width: 50px">
                <el-pagination
                        background
                        :page-size="10"
                        :pager-count="9"
                        layout="prev, pager, next"
                        :total="maxtotal"
                        @current-change="handleCurrentChange">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'SnowTalking',
        data() {
            return {
                currentDate: new Date(),
                fullscreenLoading: true,
                isnothing: false,
                uLoading: true,
                interviews: [],
                maxtotal: 100,
                items: [{}],
            };
        },
        methods: {
            handleSizeChange(val) {
                // @size-change="handleSizeChange"
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.uLoading = true;
                this.axios.post(`/postOldSonwTakling`, {
                    page: val
                }).then(res => {
                    console.log(res.data)
                    this.interviews = res.data.interviews;
                    this.uLoading = false;
                })
                console.log(`当前页: ${val}`);
            },
            gotodetail(interviewId,title) {
                this.$router.push({
                    path: `/essence/SnowTalkingDetail`,
                    query: {
                        interviewId: interviewId,
                        title:title
                    }
                })
            }
        },
        mounted: function () {
            this.axios.post(`/postOldSonwTakling`, {
                page: 1
            }).then(res => {
                this.uLoading = false;
                this.maxtotal = res.data.maxPage * 10;
                this.interviews = res.data.interviews;
                //console.log(res.data)
            })
            this.axios.get(`/getNewSnowTalking`).then(res => {
                console.log(res.data.length)
                if (res.data.length == 0) {
                    this.isnothing = true;
                } else {
                    this.isnothing = false;
                }
                const data = res.data;
                this.items = data;
                this.fullscreenLoading = false;
            });
        }
    }
</script>
<style>
    .SnowTalkingContainer{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }
    .Talkingbody{
        padding-left: 20px;
    }
    .el-drawer__header{
        align-items: center;
        color: #72767b;
        display: flex;
        padding: 20px 20px 0;
        margin-bottom:0;
    }
    .noting {
        height: 150px;
    }
    .oldTalking{
        width: 800px;
    }
    .snowtalkingUL {
        height: 228px;
    }
    .newTalking{
        width: 800px;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
        background: #545c64;
    }

    .el-loading-spinner .el-loading-text {
        color: black;
    }

    .el-loading-spinner i {
        color: black;
    }

    .SnowTalkingElcard {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
    }

    .image {
        width: 52px;
        height: 52px;
        display: block;
    }


</style>
