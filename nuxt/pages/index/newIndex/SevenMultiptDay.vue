<template>
    <div class="SevenMultiptDayContext">
        <Loading :Loading="Loading"></Loading>
        <el-card v-for="item in datas" :key="item.id" style="margin-bottom:1em " id="allTitle">
            <el-link :href="item.target" target="_blank" :underline="false">
                <h4 v-html="item.text" style="text-align: left;text-indent: 2rem;color: #3F3F3F"></h4>
            </el-link>
            <p style="text-align: right;color: #7F828B;margin-top: 2px">
                <label>{{item.created_at}}</label>
                <label>分享：{{item.share_count}}</label>
                <label>评论：{{item.reply_count}}</label>
            </p>
        </el-card>
        <el-pagination
                :page-size="30"
                :pager-count="11"
                layout="prev, pager, next"
                :total="count"
                hide-on-single-page
                @current-change=" handleCurrentChange">
        </el-pagination>
    </div>
</template>
<script>
    import Loading from '../../../components/Loading.vue'

    export default {
        name: 'SevenMultiptDayIndex',
        components: {
            Loading
        },
        asyncData() {
        },
        data() {
            return {
                datas: [],
                Loading: true,
                count: 0
            };
        },
        methods: {
            handleCurrentChange(val) {
                this.Loading = true;
                this.getdata(val, 30);
                console.log(`当前页: ${val}`);
                const anchor = this.$el.querySelector('#allTitle');
                document.documentElement.scrollTop = anchor.offsetTop - 100;
            },
            getdata(page, size) {
                this.axios.post(`/getSevenMultiptDay`, {
                    page: page,
                    size: size
                }).then(res => {
                    const list = res.data.list.data;
                    this.datas = list;
                    this.count = res.data.list.count;
                    this.Loading = false;
                    // console.log(res.data.list)
                });
            }
        },
        mounted: function () {
            this.getdata(1, 30);
            //console.log('%cmounted 钩子执行...', 'color: red; font-size: 20px;');
        },
    }
</script>
<style>
    .SevenMultiptDayContext {
        min-height: 400px;
        min-width: 400px;
    }

    .SevenMultiptDayContext .el-card__body {
        line-height: 20px;
        text-align: left;
    }

    .SevenMultiptDayContext .el-card__body div {
        text-indent: 2rem;
    }
</style>
