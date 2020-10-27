<template>
    <div style="min-height: 400px">
        <Loading :Loading="Loading"></Loading>
        <el-collapse v-model="activeNames" @change="handleChange" class="snowhotnew" id="allTitle">
            <el-collapse-item :name="item.id" v-for="item in datas" :key="item.id" style="margin-bottom:1em ">
                <template slot="title">
                    <div>
                        <div v-html="item.description" class="newtitle"></div>
                        <h4 style="text-align: right">{{item.created_at}}</h4>
                    </div>
                </template>
                <el-card>
                    <h2>{{ item.title }}</h2>
                    <div><label>作者：</label>{{item.user}}</div>
                    <el-link :href="item.url" target="_blank">
                        <div>{{item.from}}</div>
                    </el-link>
                    <div v-html="item.detail" style="text-indent: 2rem"></div>
                </el-card>
            </el-collapse-item>
        </el-collapse>
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
        name: 'snowhotnewIndex',
        components: {
            Loading
        },
        data() {
            return {
                activeNames: ['1'],
                datas: [],
                Loading: true,
                count:0
            };
        },
        methods:{
            handleChange(val) {
                // console.log(val);
            },
            handleCurrentChange(val) {
                this.Loading = true;
                this.getdata(val, 30);
                console.log(`当前页: ${val}`);
                const anchor = this.$el.querySelector('#allTitle');
                document.documentElement.scrollTop = anchor.offsetTop - 100;
            },
            getdata(page,size){
                this.axios.post(`/getsonwhotnew`,{
                    page:page,
                    size:size
                }).then(res => {
                    const list = res.data.list.data;
                    this.datas = list;
                    this.count=res.data.list.count;
                    this.Loading = false;
                    // console.log(list)
                })
            }
        },
        mounted: function () {
            this.getdata(1,30)
            //console.log('%cmounted 钩子执行...', 'color: red; font-size: 20px;');
        },
    }
</script>
<style>
    .snowhotnew .newtitle {
        max-height: 80px;
        overflow: hidden;
    }

    .snowhotnew .el-collapse-item__header {
        height: 120px;
        padding: 10px;
        line-height: 20px;
        text-indent: 2em;;
        font-family: "PingFang SC";
        text-align: left;
    }

    .snowhotnew .el-card__body {
        text-align: left;
    }

    .snowhotnew .el-card__body > h2 {
        text-align: center;
    }

</style>
