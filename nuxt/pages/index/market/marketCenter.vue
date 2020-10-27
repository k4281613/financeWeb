<template>
    <div>
        <div class="module-container">
            <h4 class="title-name">市场一览</h4>
            <el-tabs type="border-card">
                <el-tab-pane v-for="(item,index) in MarketTablAbels" :key="index">
                    <span slot="label" @click="marketCenterQuote(item.value)"> {{item.name}}</span>
                    <div class="figureModule">
                        <el-card class="box-card" v-for="(item,index) in tableData" :key="index"
                                 :style="{color:item.cardColor}">
                            <h4>
                                <label>{{item.symbol}}</label>
                                <label>{{item.name}}</label>
                                <label>{{item.currency}}</label>
                            </h4>
                            <p><label>峰值:{{item.high}}</label></p>
                            <p><label>当前:{{item.current}}</label></p>
                            <p><label>市值变化:{{item.chg}}({{item.percent}})%</label></p>
                        </el-card>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="module-container">
            <h4 class="title-name">新股预告</h4>
            <el-tabs type="border-card">
                <el-tab-pane v-for="(item,index) in NewStockTablAbels" :key="index">
                    <span slot="label" @click="getnewstockforeshow(item.value)"> {{item.name}}</span>
                    <el-table
                            :data="newStock_data"
                            border
                            show-header
                            max-widh="270"
                            size="mini">
                        <el-table-column fixed prop="name" label="股票简称" width="135">
                            <template slot-scope="scope">
                                <el-link :href="stockScreenUrl(scope.row.symbol)" target="_blank"
                                         type="primary">
                                    {{scope.row.name}}
                                </el-link>
                            </template>
                        </el-table-column>
                        <el-table-column :prop="item.field" :label="item.name" width="135"
                                         v-for="(item,index) in newStockths"
                                         :key="index">
                            <template slot-scope="scope">
                                {{scope.row[item.field] || '-'}}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="module-container">
            <h4 class="title-name">行情排行榜</h4>
            <el-tabs type="border-card">
                <el-tab-pane v-for="(item,index) in MarketSortTablAbels" :key="index">
                    <span slot="label" @click="marketsort(item.value)"> {{item.name}}</span>
                    <div class="marketsortContainer">
                        <div v-for="(list,listindex) in MarketSortList" :key="listindex">
                            <h4>{{list.name}}榜</h4>
                            <el-table
                                    :data="list.data.list"
                                    border
                                    show-header
                                    size="mini">
                                <el-table-column prop="name" label="股票" width="60">
                                    <template slot-scope="scope">
                                        <el-link :href="stockScreenUrl(scope.row.symbol)" target="_blank"
                                                 type="primary">
                                            {{scope.row.name}}
                                        </el-link>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="current" label="当前价" width="60"></el-table-column>
                                <el-table-column prop="chg" label="涨跌额" width="60" v-if="(list.field=='percent')?true:false"></el-table-column>
                                <el-table-column prop="percent" label="涨跌幅" width="60"v-if="(list.field=='percent')?false:true"></el-table-column>
                                <el-table-column :prop="list.field" :label="list.name" width="90"></el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'marketCenter',
        data() {
            return {
                MarketTablAbels: [
                    {name: '泸深', value: 'CN'},
                    {name: '港股', value: 'HK'},
                    {name: '美股', value: 'US'},
                    {name: '基金', value: 'fund'},
                ],
                NewStockTablAbels: [
                    {name: '泸深', value: 'CN'},
                    {name: '港股', value: 'HK'},
                    {name: '美股', value: 'US'},
                ],
                MarketSortTablAbels: [
                    {name: '泸A',value:'sha'},
                    {name: '泸B',value:'shb'},
                    {name: '深A',value:'sza'},
                    {name: '深B',value:'szb'},
                    {name: '创业板',value:'cyb'},
                    {name: '中小板',value:'zxb'},
                    {name: '港股',value:'hk'},
                    {name: '美股',value:'us'},
                ],
                tableData: [],
                newStockths: [],
                newStock_data: [],
                MarketSortList: [
                    {name: '', field: '', data: []}
                ]
            };
        },
        methods: {
            stockScreenUrl(symbol) {
                return 'https://xueqiu.com/S/' + symbol;
            },
            marketCenterQuote(region) {
                console.log(region)
                this.axios.post('/marketCenterQuote', {
                    region: region
                }).then(res => {
                    const data = res.data;
                    // console.log(data)
                    this.tableData = res.data;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].chg > 0) {
                            this.tableData[i].cardColor = 'red'
                        } else {
                            this.tableData[i].cardColor = 'green'
                        }
                    }
                })
            },
            getnewstockforeshow(region) {
                this.axios.post('/newStockforeshow', {
                    region: region
                }).then(res => {
                    const data = res.data;
                    console.log(data);
                    this.newStock_data = data.newStock_data;
                    this.newStockths = data.newStockths;
                })
            },
            marketsort(region) {
                this.axios.post('/marketsort',{
                    region:region
                }).then(res => {
                    const data = res.data;
                    this.MarketSortList = res.data;
                    console.log(data)
                })
            }
        },
        mounted() {
            this.marketCenterQuote('CN');
            this.getnewstockforeshow('CN');
            this.marketsort('sha');
        }
    }
</script>
<style>
    .title-name {
        text-align: left;
        font-size: 16px;
    }

    .module-container {
        margin-bottom: 20px;
        width: 900px;
    }

    .module-container .box-card {
        margin-bottom: 10px;
        width: 25%;
    }

    .figureModule {
        line-height: 20px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
    }

    .marketsortContainer {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
    }

    .marketsortContainer > div {
        width: 270px;

    }
</style>
