<template>
    <div>
        <el-page-header @back="goBack">
            <div slot="content">
                <h4>{{item.name}} {{item.symbol}}</h4>
            </div>
        </el-page-header>
        <div class="group">
            <div class="box-card">
                <div class="cube-info">
                    <div class="cube-market">沪深</div>
                    <div class="gfigure">
                        <span class="per">{{item.total_gain}}%</span>
                        <span class="period"><span>总收益</span></span>
                    </div>
                    <div style="padding: 5px">
                        <div class="cube-ranks">
                            <div>
                                <p>日</p>
                                <p class="percent">{{item.daily_gain}}%</p>
                            </div>
                            <div>
                                <p>月</p>
                                <p class="percent">{{item.monthly_gain}}%</p>
                            </div>
                            <div>
                                <p>净值</p>
                                <p class="percent">{{item.net_value}}%</p>
                            </div>
                            <div>
                                <p>总收益排行（沪深）<i class="el-icon-s-promotion"></i></p>
                                <p>跑赢<span class="percent">{{rank_percent}}%</span>组合</p>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="cube-creator-info">
                    <div class="creatorContent">
                        <div class="creater">
                            <el-avatar :size="50" :src="profile_image_url(item.owner)" @error="errorHandler">
                                <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"/>
                            </el-avatar>
                            <span style="margin: 5px;font-size: 20px;font-weight: 700">{{item.owner.screen_name}}</span>
                        </div>
                        <blockquote class="quote" v-html="">{{item.description}}</blockquote>
                    </div>
                </div>
            </div>
            <div class="mycolumn">
                <div class="firstCounmn">
                    <div class="linecharts">
                        <div id="myChart1" :style="{width: '100%', height: '300px',maxWidth:'500px'}"></div>
                    </div>
                </div>
                <div class="secondCounmn">
                    <div id="myChart2" :style="{width: '360px', height: '360px'}"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "groupdetail",
        data() {
            return {
                item: this.$route.query.item,
                rank_percent: ''
            }
        },
        methods: {
            errorHandler() {
                return true
            },
            profile_image_url(owner) {
                const str = owner.profile_image_url;
                const url = 'https:' + owner.photo_domain + str.substring(0, str.indexOf(','));
                return url
            },
            goBack() {
                this.$router.go(-1);//返回上一层
            },
        },
        mounted() {
            console.log(this.item);
            this.myChart = [
                {setChart: this.$echarts.init(document.getElementById('myChart1'), null, {renderer: 'svg'})},
                {setChart: this.$echarts.init(document.getElementById('myChart2'), null, {renderer: 'svg'})},
            ];
            this.myChart.forEach(item => {
                item.setChart.showLoading({
                    text: '数据正在努力加载...',
                    textStyle: {fontSize: 30, color: '#444'},
                    effectOption: {backgroundColor: 'rgba(0, 0, 0, 0)'}
                });
            })
            this.axios.post('/groupdetail', {
                cube_symbol: this.item.symbol,
                cube_id: this.item.id,
                market: this.item.market,
                rb_id: this.item.last_user_rb_gid
            }).then(res => {
                console.log(res.data)
                this.rank_percent = res.data.rank_percentdata.rank_percent;

                //折线图
                const linedata = res.data.linedata;
                let linedate = [], percents1 = [], percents2 = [];
                linedata[0].list.forEach(item => {
                    linedate.push(item.date)
                    percents1.push(item.percent)
                })
                linedata[1].list.forEach(item => {
                    percents2.push(item.percent)
                })
                this.myChart[0].option = {
                    title: {
                        text: '收益走势'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [linedata[0].name, linedata[1].name]
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: linedate
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: `{value} %`
                        }
                    },
                    series: [
                        {
                            name: linedata[0].name,
                            type: 'line',
                            stack: '百分比',
                            data: percents1,
                            smooth: true
                        },
                        {
                            name: linedata[1].name,
                            type: 'line',
                            stack: '百分比',
                            data: percents2,
                            smooth: true

                        },
                    ]
                };

                //饼图
                const pieedata = res.data.pieedata;
                const sub_scores = pieedata.sub_scores;
                let indicator = [],score=[];
                sub_scores.forEach(item => {
                    indicator.push({name: item.name, max: item.max_score});
                    score.push(item.score)
                })
                this.myChart[1].option = {
                    title: {
                        text: '业绩评级'
                    },
                    tooltip: {},
                    legend: {
                        data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
                    },
                    radar: {
                        // shape: 'circle',
                        name: {
                            textStyle: {
                                color: 'black',
                                backgroundColor: '#999',
                                borderRadius: 3,
                                padding: [3, 5]
                            }
                        },
                        indicator: indicator,
                        radius: 80
                    },
                    series: [{
                        name: '比例%',
                        type: 'radar',
                        // areaStyle: {normal: {}},
                        data: [
                            {
                                value: score,
                                name: '分配（Allocated Budget）',
                                emphasis: {
                                    label: {
                                        show: true,
                                        color: 'black',
                                        fontSize: 10,
                                        formatter: '{c}%',       // 鼠标悬浮时展示数据加上单位
                                        backgroundColor: '#0D1B42',
                                        borderRadius: 5,
                                    }
                                }

                            }
                        ],
                        areaStyle: { // 单项区域填充样式
                            normal: {
                                color: 'rgba(255,0,0,0.6)' // 填充的颜色。[ default: "#000" ]
                            }
                        }
                    }]
                };
                this.myChart.forEach(item => {
                    item.setChart.hideLoading();
                    item.setChart.setOption(item.option);
                })

            })
        }
    }
</script>

<style scoped>
    .linecharts {
        width: 500px;
        height: 300px;
    }

    .mycolumn {
        margin-top: 20px;
        width: 890px;
        height: auto;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
    }

    .firstCounmn {
        width: 500px;
        height: auto;
        /*min-height: 500px;*/
        /*border: 1px solid black;*/
        background: white;
        padding: 20px 0;
        box-shadow: 5px 5px 3px #888888;
    }

    .secondCounmn {
        width: 360px;
        height: auto;
        background: white;
        padding: 20px 0;
        box-shadow: 5px 5px 3px #888888;
        /*min-height: 500px;*/
        /*border: 1px solid black;*/
    }

    .group {
        /*    justify-content: center; !*子元素水平居中*!
            align-items: center; !*子元素垂直居中*!
            display: -webkit-flex;*/
        padding: 10px;
        width: 890px;
        height: 100%;
    }

    .group .box-card {
        width: 890px;
        height: 230px;
        background: #3ec7ff;
        position: relative;
        display: flex;
        justify-content: flex-start;
        flex-wrap: nowrap;
        padding: 20px;
        box-shadow: 5px 5px 3px #888888;
    }

    .group .box-card .cube-info {
        width: 500px;
        height: 190px;
        text-align: left;
        color: white;
    }

    .gfigure {
        margin-top: 20px;
    }

    .cube-market {
        width: 44px;
        line-height: 24px;
        height: 24px;
        font-size: 13px;
        border-radius: 2px;
        text-align: center;
        background-color: #3a8ee6;
        color: white;
    }

    .per {
        font-size: 64px;
        font-weight: 700;
    }

    .period {
        margin: 8px;
    }

    .cube-ranks {
        border-top: 2px solid rgba(200, 200, 200, 0.75);
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        justify-items: center;
        position: absolute;
        bottom: 10px;
        width: 490px;
        height: 70px;
        padding: 10px;
    }

    .cube-ranks > div {
        height: 50px;
        text-align: center;
    }

    .cube-ranks > div:nth-of-type(4) {
        border-left: 2px solid rgba(200, 200, 200, 0.75);
        width: 180px;
        text-align: left;
        padding-left: 15px;
    }

    .percent {
        margin-top: 4px;
        font-size: 17px;
        font-weight: 700;
    }

    .group .box-card .cube-creator-info {
        width: 360px;
        height: 190px;
        padding-left: 15px;
    }

    .creatorContent {
        width: 345px;
        height: 190px;
        background: white;
        border-radius: 2px;
        position: relative;
    }

    .quote {
        text-align: left;
        overflow: hidden;
        word-break: break-all;
        font-size: 15px;
        line-height: 1.5;
        border-radius: 2px;
        height: 60px;
        color: #888;
        padding: 5px;
        margin-left: 20px;
        width: 300px;
        background: #f8f8f8;
    }

    .creater {
        display: table-cell;
        height: 80px;
        padding-left: 20px;
        font-size: 12px;
        vertical-align: middle;
        text-align: center
    }
</style>
