<template>
    <el-container>
<!--                <el-button @click="getmovie()">默认按钮</el-button>-->
        <div id="myChart" :style="{width: '100%', height: '300px',minWidth:'550px'}"></div>
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
        <div class="hotStock"  v-loading="uLoading">
            <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick" tab-position="left">
                <el-tab-pane v-for="(item,index) in hotStockData" :key="index" :name="(index+'')">
                    <span slot="label">{{item.topic}}</span>
                    <p>
                        <el-button type="text" style="margin-right: 50px" @click="gethotstockdata(item.size,item._type,item.type)">1小时内最热</el-button>
                        <i class="el-icon-user"></i>
                        <el-button type="text" style="margin-left: 50px" @click="gethotstockdata(item.size,item._type,item.type+10)">24小时内最热</el-button>
                    </p>
                    <table>
                        <tbody>
                        <tr v-for="(children,index) in hotStockitem" :key="index"
                            :style="{'color': (children.increment > 0 ? 'red':'green')}"
                            class="hotstockli">
                            <td style="color: black">{{index + 1}}</td>
                            <td style="color: black">{{children.code}}</td>
                            <td style="color: black">
                                <el-link :href="children.url" target="_blank">{{children.name}}</el-link>
                            </td>
                            <td>
                                <i :class="[children.increment > 0 ? 'el-icon-top':'el-icon-bottom']"></i>
                            </td>
                            <td>{{children.value}}</td>
                        </tr>
                        </tbody>
                    </table>
                </el-tab-pane>
            </el-tabs>
        </div>
    </el-container>
</template>

<script>
    export default {
        name: "datashow",
        data() {
            return {
                activeName: '0',
                tableData: [],
                myChart: {},
                isred: false,
                uLoading: true,
                cardColor: 'green',
                hotStockData: [
                    {topic: '全球', size: 8, _type: 10, type: 10},
                    {topic: '美股', size: 8, _type: 11, type: 11},
                    {topic: '泸深', size: 8, _type: 12, type: 12},
                    {topic: '港股', size: 8, _type: 13, type: 13},
                ],
                hotStockitem: [],
                percentage:0
            };
        },
        computed: {},
        methods: {
            /*getmovie(){
                this.axios({
                    url:`/mymoive`,
                    methods:'get',
                    // responseType:'arraybuffer'
                }).then(res => {
                    console.log(res);
                    console.log(res.data)
                    /!*let link = document.createElement("a");
                    link.href = window.URL.createObjectURL(new Blob([res.data]));
                    link.target = "_blank";
                    //文件名和格式
                    link.download = "话术逻辑文件模板.mkv";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);*!/
                })
            },*/
            handleClick(value) {
                console.log(value.index);
                const obj = this.hotStockData[value.index];
                this.gethotstockdata(obj.size, obj._type, obj._type);
            },
            drawLine() {
                this.myChart = this.$echarts.init(document.getElementById('myChart'), null, {renderer: 'svg'})
                this.myChart.showLoading({
                    text: '数据正在努力加载...',
                    textStyle: {fontSize: 30, color: '#444'},
                    effectOption: {backgroundColor: 'rgba(0, 0, 0, 0)'}
                });
                // 绘制图表
                this.axios.get('/getdatashow').then(res => {
                    // 基于准备好的dom，初始化echarts实例
                    const data = res.data;
                    // console.log(data)
                    this.tableData = res.data;
                    let option = {
                        title: {text: '指数一览'},
                        tooltip: {},
                        xAxis: {
                            data: [],
                            axisLabel: {
                                interval: 0,
                                fontSize: 11,
                                formatter: function (value) {
                                    let maxLength = 4;//第一行显示文字个数
                                    let valLength = value.length;//X轴类目项的文字个数
                                    const ret = value.substring(0, maxLength) + "\n" + value.substring(maxLength, valLength);
                                    return ret;
                                },
                            }
                        },
                        yAxis: {},
                        series: [{
                            name: '',
                            type: 'bar',
                            data: []
                        },]
                    };
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].chg > 0) {
                            this.tableData[i].cardColor = 'red'
                        } else {
                            this.tableData[i].cardColor = 'green'
                        }
                        option.xAxis.data[i] = data[i].name;
                        option.series[0].data[i] = data[i].current;
                    }
                    this.myChart.hideLoading();
                    this.myChart.setOption(option);
                })
            },
            gethotstockdata(size, _type, type) {
                this.uLoading = true;
                this.axios.post(`/posthotstock`, {
                    size: size, _type: _type, type: type
                }).then(res => {
                    this.hotStockitem = res.data.data.items;
                    for (let i = 0; i < this.hotStockitem.length; i++) {
                        this.hotStockitem[i].url = 'https://xueqiu.com/S/' + this.hotStockitem[i].code;
                    }
                    this.uLoading = false;
                })
            }
        },
        beforeMount: function () {
            localStorage.setItem('SnowNewRoute',this.$route.path)
            // console.log('%cbeforeMount 钩子执行...', 'color: red; font-size: 20px;');
        },
        mounted() {

            // console.log(localStorage.getItem('SnowNewRoute'))
            this.gethotstockdata(8, 10, 10);
            this.drawLine();
            window.addEventListener('resize', () => {
                this.myChart.resize()
            })
        }
    }
</script>

<style>
    .box-card {
        margin-bottom: 10px;
        width: 33%;
    }

    .el-container {
        display: block;

    }

    table {
        width: 100%;
        text-align: left;
        vertical-align: middle;
        border-color: inherit;
        border-collapse: separate;
        border-spacing: 2px;
    }

    tr {
        width: 100%;
    }

    td {
        width: 25%;
    }

    .figureModule {
        line-height: 20px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }

</style>
