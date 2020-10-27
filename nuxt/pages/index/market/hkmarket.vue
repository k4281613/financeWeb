<template>
    <div class="hkmarket">
        <Loading :Loading="Loading" style="margin-top: 40px"></Loading>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="(index+'')" v-for="(item,index) in shMarketTablAbels" :key="index">
                <div class="hkmarketContainer">
                    <h4 style="margin-bottom: 10px;">{{shname}}</h4>
                    <div class="condition" v-if="conditiondisabled">
                        <div>
                            <label>选项：</label>
                            <select v-model="activeOption" @change="gethsqydata()">
                                <option v-for="(children,cindex) in myoptions" :value="children.encode"
                                        :key="cindex">{{children.name}}
                                </option>
                            </select>
                        </div>
                    </div>
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
        name: "hkmarket.vue",
        components: {
            Loading
        },
        data() {
            return {
                Loading: true,
                activeName: '0',
                shMarketTablAbels: [
                    {name: '港股一览', value: 'hk'},
                    {name: '恒生企业', value: 'hsqy'},
                    {name: '新股上市', value: 'xgss'},
                ],
                shname: '',
                ths: [],
                shdata: [],
                value: '',
                finally_column: 0,
                activeOption: '',
                myoptions: [],
                pageSize: 0,
                page: 1,
                count: 0,
                addition: {
                    encode: '5020',//基础分类
                },
                code: '',
            };
        },
        computed: {
            conditiondisabled() {
                return (this.value == 'hsqy' ) ? true : false
            }
        },
        methods: {
            //行业变化
            gethsqydata() {
                const item = this.myoptions.find(item => item.encode == this.activeOption);
                this.getshmarket(this.value, 1, item)
                // console.log(item)
            },
            //分页事件
            handleCurrentChange(val) {
                this.page = val || 1;
                this.getshmarket(this.value, val, this.addition)
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
                this.getshmarket(category, 1, this.addition);
                if (category == 'hsqy') this.activeOption = '5020';
            },
            getshmarket(category, page, addition) {
                this.axios.post('/hkmarket', {
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
                    this.myoptions = res.data.options;
                    // console.log(this.options)
                    this.finally_column = this.ths.length - 1;
                    this.Loading = false;
                    // console.log(this.finally_column)
                })
            }
        },
        mounted() {
            this.getshmarket('hk', 1, this.addition)
        }
    }
</script>
<style>
    .hkmarketContainer {
        min-height: 400px;
        width: 100%;
    }

    .condition {
        text-align: left;
        margin: 10px 0;
    }
</style>
