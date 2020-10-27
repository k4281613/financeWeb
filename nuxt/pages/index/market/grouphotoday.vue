<template>
    <div class="cube-content">
        <h3 @click="getdata(1)" id="allTitle" style="margin-bottom:30px">今日热门组合</h3>
        <el-card class="cube-cards">
            <p v-if="Loading">加載中.......</p>
            <div class="cube-card-cloumn" v-for="(item,index) in list" :key="index" >
                <div class="groupfigure">
                    <div class="rate">
                        <span class="num">{{item.total_gain}}%</span>
                    </div>
                    <div class="cube-style">总收益</div>
                </div>
                <div class="groupContext">
                    <div class="gheader">
                        <div class="cube-market">沪深</div>
                        <div class="lookdetail">
                            <el-link @click="gotodetail(item)" target="_blank">查看详情</el-link>
                        </div>
                    </div>
                    <div class="gmain">
                        <div class="gname">{{item.name}}</div>
                        <div class="gintr" v-html="item.description"></div>
                    </div>
                    <div class="gfooter">
                        <el-avatar :size="25" :src="profile_image_url(item.owner)" @error="errorHandler">
                            <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"/>
                        </el-avatar>
                        <span style="margin: 5px;">
                            {{item.owner.screen_name}}
                            <label class="unimportant">主理</label>
                        </span>
                        <span>{{item.follower_count}}<label class="unimportant">人关注</label></span>
                    </div>
                </div>
            </div>
        </el-card>
        <div style="margin-top: 20px;width: 50px">
            <el-pagination
                    background
                    :page-size="20"
                    layout="prev, pager, next"
                    :total="maxtotal"
                    :hide-on-single-page="true"
                    @current-change="handleCurrentChange">
            </el-pagination>
        </div>
    </div>
</template>
<script>

    export default {
        name: 'grouphotoday',
        data() {
            return {
                list: [],
                maxtotal: 0,
                Loading: true
            };
        },
        methods: {
            handleCurrentChange(val) {
                this.getdata(val);
                const anchor = this.$el.querySelector('#allTitle');
                document.documentElement.scrollTop = anchor.offsetTop - 100;
                console.log(`当前页: ${val}`);
            },
            errorHandler() {
                return true
            },
            gotodetail(item) {
                this.$router.push({
                    path: `/market/groupdetail`,
                    query: {
                        item: item
                    }
                })
            },
            profile_image_url(owner) {
                const str = owner.profile_image_url;
                const url = 'https:' + owner.photo_domain + str.substring(str.lastIndexOf(',') + 1, str.length);
                return url
            },
            getdata(page) {
                this.Loading = true;
                this.axios.post('/grouphotoday', {
                    page: page
                }).then(res => {
                    this.list = res.data.list;
                    this.maxtotal = res.data.totalCount;
                    this.Loading = false;
                    console.log(res.data)
                })
            }
        },
        mounted() {
            this.getdata(1);
        }
    }
</script>
<style>
    .cube-cards{
        min-height: 500px;
    }
    .el-avatar > img {
        display: block;
        height: 100%;
        vertical-align: middle;
    }

    .unimportant {
        font-size: 13px;
        color: #aaa;
        margin-left: 5px;
    }

    .cube-card-cloumn {
        display: flex;
        justify-content: flex-start;
        text-align: left;
        width: 100%;
        flex-wrap: wrap;
        position: relative;
        margin-bottom: 15px;
    }

    .groupfigure {
        background-color: #3ec7ff;
        width: 140px;
        height: 140px;
        position: relative;
        border-radius: 50%;
    }

    .groupContext {
        width: calc(100% - 160px);
        height: 140px;
        margin-left: 20px;
        border: 1px solid black;
    }

    .rate {
        text-align: center;
        font-size: 20px;
        color: #fff;
        padding-top: 45px;
        width: 100%;
    }

    .rate .num {
        font-size: 32px;
        font-weight: 700;
    }

    .cube-style {
        color: #fff;
        text-align: center;
        font-size: 16px;
        opacity: .6;
    }

    .gheader {
        height: 30px;
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
        margin-top: 10px;
    }

    .cube-market {
        width: 32px;
        line-height: 24px;
        height: 24px;
        font-size: 12px;
        border-radius: 2px;
        text-align: center;
        background-color: #3ec7ff;
        color: white;
    }

    .lookdetail {
        font-size: 12px;
        height: 24px;
        padding-right: 20px;
    }

    .gname {
        position: absolute;
        top: 46px;
        font-weight: 400;
        font-size: 18px;
        color: #333;
    }

    .gintr {
        position: absolute;
        overflow: hidden;
        word-break: break-all;
        font-size: 13px;
        top: 72px;
        line-height: 1.5;
        height: 45px;
        color: #888;
    }

    .gfooter {
        position: absolute;
        font-size: 13px;
        height: 30px;
        bottom: 5px;
    }
</style>
