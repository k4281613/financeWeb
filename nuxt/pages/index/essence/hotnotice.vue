<template>
    <div>
        <h2>热门公告</h2>
        <div class="hotnew">
            <el-divider></el-divider>
            <div v-if="!interviews.length">
                <p style="text-align: left">暂无数据</p>
            </div>
            <ul v-loading="uLoading"
                element-loading-text="拼命加载数据中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="#E9EEF3"
                class="hotnewUL" style="z-index: 1">
                <li v-for="(item,index) in interviews" :key="index" style="text-align: left">
                    <p>
                        <el-link target="_blank" @click="gotodetail(item)">{{item.description}}</el-link>
                        <label style="font-size: 10px">({{item.created_at}})</label>
                    </p>
                </li>
            </ul>
            <div style="margin-top: 20px;width: 50px">
                <el-pagination
                        v-if="interviews.length"
                        background
                        :page-size="10"
                        layout="prev, pager, next"
                        :total="maxtotal"
                        :hide-on-single-page="true"
                        @current-change="handleCurrentChange">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "hotnotic",
        data() {
            return {
                uLoading: true,
                interviews: [],
                maxtotal: 100,
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.uLoading = true;
                this.axios.post(`/posthotmessage`, {
                    page: val,
                    type: 'notice'
                }).then(res => {
                    // console.log(res.data)
                    this.interviews = res.data;
                    this.uLoading = false;
                })
                // console.log(`当前页: ${val}`);
            },
            gotodetail(item) {
                this.$router.push({
                    path: `/essence/hotnewDetail`,
                    query: {
                        item:item
                    }
                })
            }
        },
        mounted() {
            this.axios.post(`/posthotmessage`, {
                page: 1,
                type: 'notice'
            }).then(res => {
                this.interviews = res.data;
                for(let i=0;i<this.interviews.length;i++){
                    const str = this.interviews[i].description
                    this.interviews[i].description = str.substring(0,str.indexOf('<'));
                }
                if(this.interviews.length<10)this.maxtotal=this.interviews.length
                this.uLoading = false;
                console.log(res.data)
            })
        }
    }
</script>

<style scoped>
    .hotnewUL li p {
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
    }

    .hotnewUL {
        height: 248px;
    }

    .hotnew {
        min-width: 600px;
    }

    .el-pagination.is-background .el-pager li:not(.disabled).active {
        background: #545c64;
    }

</style>
