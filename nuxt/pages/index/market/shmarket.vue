<template>
    <div class="shmarket">
        <Loading :Loading="Loading" style="margin-top: 40px"></Loading>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="item.name" :name="(index+'')" v-for="(item,index) in shMarketTablAbels" :key="index">
                <div class="shmarketContainer">
                    <h4 style="margin-bottom: 10px;">{{shname}}</h4>
                    <div class="condition" v-if="conditiondisabled">
                        <div class="block" v-if="lhbdisabled">
                            <span class="demonstration">默认</span>
                            <el-date-picker
                                    @change="getlhbdata"
                                    v-model="datevalue"
                                    type="date"
                                    placeholder="选择日期"
                                    :picker-options="pickerOptions">
                            </el-date-picker>
                        </div>
                        <div v-if="jcfldisabled">
                            <label>选项：</label>
                            <select v-model="activeOption" @change="getjcfldata()">
                                <option v-for="(children,cindex) in myoptions" :value="children.data_level2code"
                                        :key="cindex">{{children.name}}
                                </option>
                            </select>
                        </div>
                        <div v-if="phdisabled">
                            <select v-model="activeOption" @change="getphdata()" v-if="phdisabled">
                                <option v-for="(children,cindex) in myoptions"
                                        :value="children.data_type+children.order+children.order_by"
                                        :key="cindex">{{children.name}}
                                </option>
                            </select>
                        </div>
                        <div class="demo-input-suffix" v-if="nbjydisabled">
                            筛选：
                            <el-input placeholder="请输入正确的股票代码" v-model="code" style="width: 200px"></el-input>
                            <el-button @click="nbjystockdata()">搜索</el-button>
                        </div>
                    </div>
                    <div class="context">
                        <el-table :data="shdata" style="width: 100%;" max-height="400" size="mini" border
                                  v-if="!ahyjdisabled">
                            <el-table-column :prop="children.field" :label="children.name" min-width="100"
                                             v-for="(children,cindex) in ths" :key="cindex"
                                             :fixed="setfixed(cindex)"></el-table-column>
                        </el-table>
                        <el-table :data='shdata' style="width: 100%;" max-height="400" size="mini" border
                                  v-if="ahyjdisabled">
                            <el-table-column label="A股" min-width="300">
                                <el-table-column label="股票" min-width="70" prop="name_cn"></el-table-column>
                                <el-table-column label="代码" min-width="70" prop="symbol_cn"></el-table-column>
                                <el-table-column label="价格（元）" min-width="80" prop="current_cn"></el-table-column>
                                <el-table-column label="涨跌幅" min-width="80" prop="percent_cn"></el-table-column>
                            </el-table-column>
                            <el-table-column label="H股" min-width="300">
                                <el-table-column label="股票" min-width="70" prop="name_hk"></el-table-column>
                                <el-table-column label="代码" min-width="70" prop="symbol_hk"></el-table-column>
                                <el-table-column label="价格（元）" min-width="80" prop="current_hk"></el-table-column>
                                <el-table-column label="涨跌幅%" min-width="80" prop="percent_hk"></el-table-column>
                            </el-table-column>
                            <el-table-column label="溢价(H/A)" min-width="100" prop="premium"></el-table-column>
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
                    <el-button-group style="float: right;margin-top: 10px" v-if="nbjydisabled">
                        <el-button  icon="el-icon-arrow-left" size="small" v-if="lastpagedisabled" @click="lastpagedata()">上一页</el-button>
                        <el-button  size="small" @click="nextpagedata()">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                    </el-button-group>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import Loading from '../../../components/Loading.vue'

    export default {
        name: 'shmarket',
        components: {
            Loading
        },
        data() {
            return {
                Loading: true,
                activeName: '0',
                shMarketTablAbels: [
                    {name: '泸深一览', value: 'sh'},
                    {name: '科创板', value: 'kcb'},
                    {name: '基础分类', value: 'jcfl'},
                    {name: '排行', value: 'ph'},
                    {name: '新股上市', value: 'xgss'},
                    {name: '龙虎榜', value: 'lhb'},
                    {name: 'AH股溢价', value: 'ahyj'},
                    {name: '内部交易', value: 'nbjy'},
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
                    data_level2code: 's2701',//基础分类
                    data_type: 'cyb',//排行
                    order_by: 'percent',//排行
                    order: 'desc',//排行
                    start_date:new Date(new Date().toLocaleDateString()).getTime(),//龙虎榜
                    end_date:Date.now(),//龙虎榜
                    code:''//内部交易
                },
                datevalue: new Date(new Date().toLocaleDateString()).getTime(),
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                restaurants: [],
                code: '',
            };
        },
        computed: {
            lastpagedisabled(){
                return (this.page !== 1) ? true : false
            },
            lhbdisabled() {
                return (this.value == 'lhb') ? true : false
            },
            nbjydisabled() {
                return (this.value == 'nbjy') ? true : false
            },
            jcfldisabled() {
                return (this.value == 'jcfl') ? true : false
            },
            phdisabled() {
                return (this.value == 'ph') ? true : false
            },
            conditiondisabled() {
                return (this.value == 'jcfl' || this.value == 'ph' || this.value == 'lhb' || this.value == 'nbjy') ? true : false
            },
            ahyjdisabled() {
                return (this.value == 'ahyj') ? true : false
            }
        },
        methods: {
            nbjystockdata(){
                let code;
                (this.code)?code=`&symbol=${this.code}`:code='';
                this.getshmarket(this.value, 1, {code:code})
            },
            lastpagedata(){
                this.page--;
                let code;
                (this.code)?code=`&symbol=${this.code}`:code='';
                this.getshmarket(this.value, this.page, {code:code})
            },
            nextpagedata(){
                this.page++;
                let code;
                (this.code)?code=`&symbol=${this.code}`:code='';
                this.getshmarket(this.value, this.page, {code:code})
            },
            getlhbdata(){
              // console.log(this.datevalue.getTime(),Date.now());
              this.getshmarket(this.value, 1, {
                  start_date:this.datevalue.getTime(),
                  end_date:this.datevalue.getTime()+ 86400
              })
            },
            getjcfldata() {
                const item = this.myoptions.find(item => item.data_level2code == this.activeOption);
                this.getshmarket(this.value, 1, item)
                // console.log(item)
            },
            getphdata() {
                // console.log(this.activeOption)
                const item = this.myoptions.find(item => (item.data_type + item.order + item.order_by) == this.activeOption);
                this.getshmarket(this.value, 1, item)
                // console.log(item)
            },
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
            handleClick(val) {
                this.page = 1;
                console.log(val.index);
                this.Loading = true;
                const category = this.shMarketTablAbels[val.index].value
                this.getshmarket(category, 1, this.addition);
                if (category == 'jcfl') this.activeOption = 'S2701';
                if (category == 'ph') this.activeOption = 'cybdescpercent';
            },
            getshmarket(category, page, addition) {
                this.axios.post('/shmarket', {
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
                    this.value = res.data.value;
                    this.myoptions = res.data.options;
                    // console.log(this.options)
                    if (category !== 'ahyj') this.finally_column = this.ths.length - 1;
                    this.Loading = false;
                    // console.log(this.finally_column)
                })
            }
        },
        mounted() {
            this.getshmarket('sh', 1, this.addition)
        }
    }
</script>
<style>
    .shmarketContainer {
        min-height: 400px;
        width: 100%;
    }

    .condition {
        text-align: left;
        margin: 10px 0;
    }
</style>
