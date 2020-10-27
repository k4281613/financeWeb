<template>
    <div class="fundmarket">
        <Loading :Loading="Loading" style="margin-top: 40px"></Loading>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="(index+'')" v-for="(item,index) in shMarketTablAbels" :key="index">
                <div class="fundmarketContainer">
                    <h4 style="margin-bottom: 10px;">{{shname}}</h4>
                    <div class="context">
                        <el-table :data="shdata" style="width: 100%;" max-height="400" size="mini" border>
                            <el-table-column :prop="children.field" :label="children.name" min-width="100"
                                             v-for="(children,cindex) in ths" :key="cindex"
                                             :fixed="setfixed(cindex)"></el-table-column>
                        </el-table>
                        <el-pagination
                                style="margin-top: 10px;float: right"
                                :page-size="pageSize"
                                :pager-count="11"
                                layout="prev, pager, next"
                                :total="count"
                                hide-on-single-page
                                @current-change=" handleCurrentChange">
                        </el-pagination>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import Loading from '../../../components/Loading.vue'

    export default {
        name: "fundmarket.vue",
        components: {
            Loading
        },
        data() {
            return {
                Loading: true,
                activeName: '0',
                shMarketTablAbels: [
                    {name: '分级基金', value: 'classification'},
                    {name: '货币性', value: 'currency'},
                    {name: '股票型', value: 'stocket'},
                    {name: '债券型', value: 'debt'},
                    {name: '混合型', value: 'mixture'},
                    {name: 'QDII基金', value: 'QDII'},
                    {name: '指数型基金', value: 'figure'},
                    {name: 'ETF', value: 'ETF'},
                    {name: 'LOF', value: 'LOF'},
                    {name: 'FOF', value: 'FOF'},
                ],
                shname: '',
                ths: [],
                shdata: [],
                value: '',
                finally_column: 0,
                pageSize: 0,
                page: 1,
                count: 0,
            };
        },
        computed: {
        },
        methods: {
            //分页事件
            handleCurrentChange(val) {
                this.page = val || 1;
                this.getshmarket(this.value, val, '')
            },
            setfixed(index) {
                let fixed;
                if (index == this.finally_column && this.finally_column > 6) {
                    fixed = 'right';
                } else if (index == 0) {
                    fixed = true;
                } else {
                    fixed = false;
                }
                return fixed
            },
            //切换tab事件
            handleClick(val) {
                this.page = 1;
                console.log(val.index);
                this.Loading = true;
                const category = this.shMarketTablAbels[val.index].value
                this.getshmarket(category, 1, '');
            },
            getshmarket(category, page, addition) {
                this.axios.post('/fundmarket', {
                    category: category,
                    page: page,
                    addition: addition
                }).then(res => {
                    console.log(res.data);
                    this.shname = res.data.name;
                    this.ths = res.data.ths;
                    this.shdata = res.data.stockdata.list;
                    this.pageSize = res.data.stockdata.list.length;
                    this.count = res.data.stockdata.count;
                    this.value = res.data.value;//tab头
                    this.finally_column = this.ths.length - 1;
                    this.Loading = false;
                    // console.log(this.finally_column)
                })
            }
        },
        mounted() {
            this.getshmarket('classification', 1, '')
        }
    }
</script>
<style>
    .fundmarketContainer {
        min-height: 400px;
        width: 100%;
    }

    .condition {
        text-align: left;
        margin: 10px 0;
    }
</style>
