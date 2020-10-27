<template>
    <div class="sizer">
        <div class="wrapperSizer">
            <el-tabs type="border-card">
                <el-tab-pane v-for="(fitem,findex) in tablist" :key="findex">
                    <span slot="label" @click="regionStock(fitem.value)"> {{fitem.name}}</span>
                    <div class="stockScreener-range">
                        <h4>选择范围：</h4>
                        <div class="stockScreener-range-wrapper">
                            <div v-if="isCN(fitem.value)">
                                <label>市场：</label>
                                <select class="form-control" v-model="exchange">
                                    <option value="sh_sz">全部A股</option>
                                    <option value="sha">沪市A股</option>
                                    <option value="sza">深市A股</option>
                                </select>
                            </div>
                            <div>
                                <label>行业：</label>
                                <select class="form-control" v-model="indcode">
                                    <option value="">全部</option>
                                    <option :value="item.encode" v-for="(item,index) in options.industries"
                                            :key="index">{{item.name}}
                                    </option>
                                </select>
                            </div>
                            <div v-if="isCN(fitem.value)">
                                <label>地域板块：</label>
                                <select class="form-control" v-model="areacode">
                                    <option value="">全部</option>
                                    <option :value="name" v-for="(value,name,index) in options.areas" :key="index">
                                        {{value}}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="stockScreener-condition">
                        <h4>条件设置：</h4>
                        <el-tabs tab-position="left" style="min-height: 200px;">
                            <el-tab-pane :label="name" v-for="(value,name,index) in options.sizer_select" :key="index">
                                <el-checkbox-group v-model="checkList" @change="handleCheckAllChange"
                                                   v-if="(name=='财务报表')?false:true">
                                    <el-checkbox :label="item.field" v-for="(item,childindex) in value"
                                                 :key="childindex"
                                                 @change="handleCheckChange(item.field,item.adj,item.name)">
                                        {{item.name}}
                                    </el-checkbox>
                                </el-checkbox-group>
                                <el-collapse v-model="activeNames" v-if="(name=='财务报表')?true:false">
                                    <el-collapse-item v-for="(child,childindex) in value" :key="childindex">
                                        <template slot="title">
                                            {{objectKey(child)}}
                                        </template>
                                        <el-checkbox-group v-model="checkList" @change="handleCheckAllChange">
                                            <el-checkbox :label="grandson.field"
                                                         v-for="(grandson,grandsonindex) in Object.values(child)[0]"
                                                         :key="grandsonindex"
                                                         @change="handleCheckChange(grandson.field,grandson.adj,grandson.name)">
                                                {{grandson.name}}
                                            </el-checkbox>
                                        </el-checkbox-group>
                                    </el-collapse-item>
                                </el-collapse>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <div class="stockScreener-selected">
                        <h4>筛选条件：</h4>
                        <div class="stockScreener-range-wrapper">
                            <table style="width: 670px">
                                <tbody>
                                <tr>
                                    <th style="color: black;width: 20%">条件</th>
                                    <th style="color: black;width: 20%">最小值</th>
                                    <th style="color: black;width: 20%">最大值</th>
                                    <th style="color: black;width: 20%">日期设置</th>
                                    <th style="color: black;width: 20%">删除</th>
                                </tr>
                                <tr v-for="(item,index) in selectList" :key="index">
                                    <td style="color: black;width: 20%">
                                        {{item.name}}
                                    </td>
                                    <td style="color: black;width: 20%">
                                        <el-input v-model="item.min" type="number"></el-input>
                                    </td>
                                    <td style="color: black;width: 20%">
                                        <el-input v-model="item.max" type="number"></el-input>
                                    </td>
                                    <td style="color: black;width: 20%">
                                        <el-input placeholder="最新数据" :disabled="true" v-if="!item.adj"></el-input>
                                        <select v-model="item.year" v-if="item.adj" class="condition_select"
                                                @change="updataScreendata(item.name, item.filed, item.adj, item.year, item.date,index)">
                                            <option v-for="(year,yindex) in years" :key="yindex" :value="year">
                                                {{year}}
                                            </option>
                                        </select>
                                        <select v-model="item.date" v-if="item.adj" class="condition_select"
                                                @change="updataScreendata(item.name, item.filed, item.adj, item.year, item.date,index)">
                                            <option value="0331">一季报</option>
                                            <option value="0630">中报</option>
                                            <option value="0930">三季报</option>
                                            <option value="1231">年报</option>
                                        </select>
                                    </td>
                                    <td style="color: black;width: 20%">
                                        <i class="el-icon-close" @click="deleteselect(item.filed,index)"></i>
                                    </td>

                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div style="padding: 20px 0;text-align: center">
                            <el-button type="primary" size="small" @click="reset()" v-if="selectList.length"
                                       style="float: left;"> 重置
                            </el-button>
                            <span v-if="!selectList.length">从上方筛选条件</span>
                            <el-button type="primary" size="small" style="float: right;margin-right: 50px"
                                       @click="searchValues()"> 开始选股
                            </el-button>
                        </div>
                    </div>
                    <div class="stockScreener-search-result">
                        <p>符合条件的股票<span style="color: red">{{shockData.count}}</span>只</p>
                        <div class="stockScreener-search-result-table-container">
                            <div class="stockScreener-search-result-table mainTable">
                                <div style="text-align: center">
                                    <span v-if="!shockData.count">这里显示搜索结果</span>
                                    <el-table
                                            v-if="shockData.count"
                                            :data="shockData.list"
                                            border
                                            show-header
                                            max-height="400"
                                            max-widh="670">
                                        <el-table-column fixed prop="name" label="股票" width="100">
                                            <template slot-scope="scope">
                                                <el-link :href="stockScreenUrl(scope.row.symbol)" target="_blank"
                                                         type="primary">
                                                    {{scope.row.name}}
                                                </el-link>
                                            </template>
                                        </el-table-column>
                                        <el-table-column :prop="item.filed" :label="item.name" width="100"
                                                         v-for="(item,index) in stockScreenerths"
                                                         :key="index"></el-table-column>
                                        <el-table-column label="操作" width="100">
                                            <template slot-scope="scope">
                                                <el-link :href="stockScreenUrl(scope.row.symbol)" target="_blank"
                                                         type="primary">
                                                    查看
                                                </el-link>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <el-pagination
                                            :page-size="30"
                                            :pager-count="11"
                                            layout="prev, pager, next"
                                            :total="shockData.count"
                                            @current-change="handleCurrentChange"
                                            v-if="shockData.count">
                                    </el-pagination>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="wrapperRanking">
            <el-card>
                <h4>股票排行榜</h4>
                <select @change="stockSorter()" v-model="stockSorterValue">
                    <option v-for="(item,index) in foundation_figure" :key="index" :value="item.field">{{item.name}}
                    </option>
                </select>
                <el-table
                        :data="foundation_data"
                        show-header
                        max-widh="270"
                        size="mini"
                        v-loading="loading"
                        element-loading-text="拼命加载中"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(255, 255, 255, 1)">
                    <el-table-column fixed prop="name" label="股票" width="90">
                        <template slot-scope="scope">
                            <el-link :href="stockScreenUrl(scope.row.symbol)" target="_blank"
                                     type="primary">
                                {{scope.row.name}}
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column :prop="item.filed" :label="item.name" width="90"
                                     v-for="(item,index) in stockSorterths"
                                     :key="index"></el-table-column>
                </el-table>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "sizer",
        data() {
            return {
                stockScreenerths: [],
                checkList: [],
                tablist: [
                    {name: '泸深', value: 'CN'},
                    {name: '港股', value: 'HK'},
                    {name: '美股', value: 'US'},
                ],
                years: [2014, 2015, 2016, 2017, 2018, 2019, 2020],
                options: {},
                activeNames: ['1'],
                selectList: [],
                shockData: {
                    list: [],
                    count: 0
                },
                condition: '',
                exchange: 'sh_sz',
                areacode: '',
                indcode: '',
                region: 'CN',
                foundation_figure: [],
                stockSorterValue: 'pettm',
                stockSorterths: [
                    {name: '当前价', filed: 'current'},
                    {name: '市盈率TTM', filed: 'pettm'},
                ],
                foundation_data: [],
                loading: true
            }
        },
        computed: {},
        methods: {
            stockSorter() {
                let date;
                this.loading = true;
                this.foundation_figure.forEach(item => {
                    if (item.field == this.stockSorterValue) {
                        (item.adj == 0) ? date = '' : date = '.20200331';
                        this.stockSorterths[1].name = item.name;
                        this.stockSorterths[1].filed = item.field;
                    }
                });
                this.axios.post('/searchValues', {
                    page: 1,
                    region: this.region,
                    sizer: 10,
                    condition: '',
                    exchange: '',
                    areacode: '',
                    indcode: '',
                    order: 'desc',
                    order_by: this.stockSorterValue + date
                }).then(res => {
                    this.foundation_data = res.data.list;
                    this.loading = false;
                    console.log(res.data)
                })
            },
            isCN(value) {
                return (value == 'CN') ? true : false;
            },
            regionStock(value) {
                console.log(value);
                this.region = value;
                this.checkList = [];
                this.selectList = [];
                this.shockData = {
                    list: [],
                    count: 0
                };
                this.condition = '';
                if (value !== 'CN') this.exchange = ''; else this.exchange = 'sh_sz';
                this.areacode = '';
                this.indcode = '';
                this.axios.post('/postlist_sizer', {
                    region: value
                }).then(res => {
                    this.options = res.data;
                    console.log(this.options)
                })
            },
            //分页
            handleCurrentChange(val) {
                console.log(val);
                this.axios.post('/searchValues', {
                    page: val,
                    region: this.region,
                    sizer: 30,
                    condition: this.condition,
                    exchange: this.exchange,
                    areacode: this.areacode,
                    indcode: this.indcode,
                    order: 'desc',
                    order_by: 'symbol'
                }).then(res => {
                    console.log(res.data)
                    this.shockData = res.data;
                })
            },
            stockScreenUrl(symbol) {
                return 'https://xueqiu.com/S/' + symbol;
            },
            objectKey(obj) {
                //console.log(obj)
                return Object.keys(obj)[0];
                // return Object.keys(obj)[index];
            },
            searchValues() {
                let condition = '';
                this.stockScreenerths = [
                    {name: '当前价', filed: 'current'},
                    {name: '当日涨跌幅', filed: 'pct'},
                ];
                for (let i = 0; i < this.selectList.length; i++) {
                    let date;
                    (this.selectList[i].adj == 0) ? date = '' : date = `.${this.selectList[i].year}${this.selectList[i].date}`;
                    condition = condition + `&${this.selectList[i].filed}${date}=${parseFloat(this.selectList[i].min)}_${parseFloat(this.selectList[i].max)}`;
                    let obj = {
                        name: this.selectList[i].name,
                        filed: this.selectList[i].filed
                    }
                    const bool = this.stockScreenerths.some(item => {
                        return (item.filed == obj.filed) ? true : false;
                    })
                    if (!bool) this.stockScreenerths.push(obj);
                }
                this.axios.post('/searchValues', {
                    page: 1,
                    sizer: 30,
                    region: this.region,
                    condition: condition,
                    areacode: this.areacode,
                    exchange: this.exchange,
                    indcode: this.indcode,
                    order: 'desc',
                    order_by: 'symbol'
                }).then(res => {
                    console.log(res.data)
                    this.condition = condition;
                    this.shockData = res.data;
                })
            },
            reset() {
                this.selectList = [];
                this.checkList = [];
            },
            getArrayIndex(value, arr) {
                return arr.findIndex(item => item === value);
            },
            deleteselect(filed, index) {
                console.log(this.selectList[index]);
                this.selectList.splice(index, 1);
                this.checkList.splice(this.getArrayIndex(filed, this.checkList), 1);
            },

            //多选框组变化事件
            handleCheckAllChange(val) {
                // console.log(val)
            },

            //判断是否选中
            checkBool(filed) {
                return this.checkList.some(item => item == filed);
            },
            updataScreendata(name, filed, adj, year, date, index) {
                this.axios.post('/postScreenerValues', {
                    filed: filed,
                    adj: adj,
                    date: '.' + year + date
                }).then(res => {
                    const data = res.data;
                    let obj = {
                        max: data.max.toFixed(2),
                        min: data.min.toFixed(2),
                        adj: adj,
                        name: name,
                        filed: filed,
                        year: year,
                        date: date
                    }
                    // this.selectList[index] = obj;//vue不允许在已经创建的实例上动态更新新的根及响应式属性，故该方法错误
                    this.$set(this.selectList, index, obj);//注：当发现model上的数据发生改变，而页面上的视图数据没有改变，推荐使用该方法。
                    console.log(this.selectList)
                    // this.$forceUpdate()
                })
            },
            getScreendata(name, filed, adj) {
                this.axios.post('/postScreenerValues', {
                    filed: filed,
                    adj: adj,
                    date: ''
                }).then(res => {
                    const data = res.data;
                    let obj = {
                        max: data.max.toFixed(2),
                        min: data.min.toFixed(2),
                        adj: adj,
                        name: name,
                        filed: filed
                    }
                    if (adj) {
                        obj.year = 2020;
                        obj.date = '0331';
                    }
                    this.selectList.push(obj)
                    // console.log(this.selectList)
                })
            },
            handleCheckChange(filed, adj, name) {
                if (this.checkBool(filed)) {
                    console.log(filed, adj, name, '选中');
                    this.getScreendata(name, filed, adj);
                } else {
                    console.log(filed, adj, '关闭');
                    let i = this.selectList.findIndex(item => item.filed == filed);
                    if (i !== -1) this.selectList.splice(i, 1);
                    // for (let i = 0; i < this.selectList.length; i++) {
                    //     if (filed == this.selectList[i].filed) {
                    //         this.selectList.splice(i, 1);
                    //         break;
                    //     }
                    // }
                }
            }
        },
        mounted() {
            this.axios.post('/searchValues', {
                page: 1,
                region: this.region,
                sizer: 10,
                condition: '',
                exchange: '',
                areacode: '',
                indcode: '',
                order: 'desc',
                order_by: this.stockSorterValue
            }).then(res => {
                this.foundation_data = res.data.list
                console.log(res.data)
            })
            this.axios.post('/postlist_sizer', {
                region: 'CN'
            }).then(res => {
                this.options = res.data;
                this.foundation_figure = this.options.sizer_select['基本指标']
                this.loading=false;
                console.log(this.options)
            })
        }
    }
</script>

<style>
    .condition_select {
        background: #ffffff;
        height: 20px;
        display: inline-block;
        padding: 0px;
        margin-bottom: 9px;
        font-size: 13px;
        color: #555555;
        border: 1px solid #cccccc;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }

    .stockScreener-search-result {
        font-size: 14px;
        margin-top: 20px;
    }

    .stockScreener-range-wrapper {
        display: flex;
        justify-items: center;
        flex-wrap: nowrap;
    }

    .stockScreener-range-wrapper > div {
        margin-right: 20px;
    }

    .stockScreener-range, .stockScreener-condition, .stockScreener-selected, .stockScreener-search-result {
        text-align: left;
    }

    .sizer {
        width: 100%;
        display: flex;
        justify-items: center;
        flex-wrap: wrap;
    }

    .wrapperSizer {
        width: 700px;
        margin-bottom: 20px;
    }

    .wrapperRanking {
        min-width: 270px;
    }

</style>
