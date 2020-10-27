'use strict';

const {Service} = require('egg');
const fs = require('fs');
const myEcoding = 'UTF-8';
const path = require('path');
const request = require('request');
const Promise = require('bluebird');
const myIconv = require('iconv-lite/lib/index');
const myCheerio = require('cheerio');
const timeout = 8000;
const myURL = 'https://xueqiu.com/hq#';

class MarketService extends Service {
    async searchValues(sizer, region, exchange, areacode, indcode, page, condition, order, order_by) {
        const ctx = this.ctx;
        const that = this;
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
        let real_condition;
        (condition == '') ? real_condition = '&mc=&volume=' : real_condition = condition;
        let JsonURl = `https://xueqiu.com/service/screener/screen?category=${region}&exchange=${exchange}&areacode=${areacode}&indcode=${indcode}&order_by=${order_by}&order=${order}&page=${page}&size=${sizer}&only_count=0${real_condition}&_=${Date.now()}`;
        console.log(JsonURl)
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 1, JsonURl);
        const result = await that.getJsons(JsonURl, options);
        let list = result.list;
        list.forEach(item => {
            Object.keys(item).forEach(children => {
                let re = new RegExp("[\\u4E00-\\u9FFF]+", "g");//判断是否含有汉子
                if (!re.test(item[children])) item[children] = that.ctx.helper.unitConverter(item[children]);
            })
        })
        result.list = list;
        return result;
    }

    async screenerValues(filed, adj, date) {
        const ctx = this.ctx;
        const that = this;
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
        let real_filed;
        let real_date = date || '.20200331';
        (adj == 0) ? real_filed = filed : real_filed = filed + real_date;
        let JsonURl = `https://xueqiu.com/service/screener/values?category=CN&field=${real_filed}&_=${Date.now()}`;
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 1, JsonURl);
        const result = await that.getJsons(JsonURl, options);
        return result
    }

    async getJsons(url, options) {
        options.url = url;
        return new Promise((resolve, reject) => {
            try {
                request(options, function (err, res, body) {
                    if (!err && res.statusCode == 200) {
                        resolve(JSON.parse(body.toString()).data);
                    } else {
                        reject(err)
                    }
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    async IndustriesList(region) {
        const ctx = this.ctx;
        const that = this;
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 0, '');
        const industries = await that.getJsons(`https://xueqiu.com/service/screener/industries?category=${region}&_=${Date.now()}`, options)
        return industries;
    }

    async getlist(region) {//CN,HK,US
        const ctx = this.ctx;
        const that = this;
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 0, '');
        const file = path.join(__dirname, `../public/static/sizer_select_${region}_string.json`);
        const areas = await that.getJsons(`https://xueqiu.com/service/screener/areas?_=${Date.now()}`, options);
        const industries = await that.getJsons(`https://xueqiu.com/service/screener/industries?category=${region}&_=${Date.now()}`, options)

        let obj = {
            sizer_select: JSON.parse(fs.readFileSync(file).toString()),
            areas: areas.areas,
            industries: industries.industries
        }
        return obj;

    }

    async marketCenter(region) {
        const ctx = this.ctx;
        const that = this;
        const arr = [
            {region: 'CN', symbol: 'SH000001%2CSZ399001%2CSZ399006%2CSH000688'},
            {region: 'HK', symbol: 'HKHSI%2CHKHSCCI%2CHKHSCEI%2CHKVHSI'},
            {region: 'US', symbol: '.DJI%2C.IXIC%2C.INX%2CICS30'},
            {region: 'fund', symbol: 'SH000011'}
        ]
        const real_symbol = arr.find(item => item.region == region);
        let getJsonUrl = `https://xueqiu.com/service/v5/stock/batch/quote?symbol=${real_symbol.symbol}&_=${Date.now()}`;
        // console.log(getJsonUrl);
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 1, getJsonUrl);
        return new Promise((resolve, reject) => {
            try {
                //console.log(options)
                request(options, async function (err, res, body) {
                    if (!err && res.statusCode == 200) {
                        const html = myIconv.decode(body, myEcoding);
                        const JsonData = JSON.parse(html).data;
                        const items = JsonData.items;
                        let data = []
                        for (let i = 0; i < items.length; i++) {
                            let obj = {};
                            const quote = items[i].quote;
                            obj.chg = quote.chg;
                            obj.symbol = quote.symbol;
                            obj.currency = quote.currency;
                            obj.current = quote.current;
                            obj.high = quote.high;
                            obj.name = quote.name;
                            obj.percent = quote.percent;
                            data[i] = obj
                        }
                        //console.log(data);
                        resolve(data);
                    } else {
                        console.error(err)
                    }
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    async newStockforeshow(region) {
        const ctx = this.ctx;
        const that = this;
        const arr = [
            {
                region: 'CN',
                JsonUrl: `https://xueqiu.com/service/v5/stock/preipo/cn/query?type=subscribe&order_by=onl_subbeg_date&order=asc&page=1&size=10&_=${Date.now()}`
            },
            {
                region: 'US',
                JsonUrl: `https://xueqiu.com/service/v5/stock/preipo/us/list?order_by=list_date&order=asc&page=1&size=10&type=unlisted&_=${Date.now()}`
            },
            {
                region: 'HK',
                JsonUrl: `https://xueqiu.com/service/v5/stock/preipo/hk/query?page=1&size=10&order=asc&order_by=list_date&type=unlisted&_=${Date.now()}`
            },
        ]
        const realUrl = arr.find(item => item.region == region);
        let getJsonUrl = realUrl.JsonUrl;
        // console.log(getJsonUrl);
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 1, getJsonUrl);
        const data = await that.getJsons(getJsonUrl, options);
        let newStock_data, newStockths;
        if (region == 'CN') {
            newStockths = [
                {name: '申购代码', field: 'onl_subcode'},
                {name: '申购日期', field: 'onl_distr_date'},
                {name: '网上发行量(万)', field: 'onl_actissqty'},
                {name: '申购上限(万)', field: 'onl_sub_maxqty'},
                {name: '预计发行量（万）', field: 'actissqty'},
                {name: '发行价', field: 'iss_price'},
                {name: '中签号公布日', field: 'onl_lotwiner_stpub_date'},
            ]
            newStock_data = data.items;
            newStock_data.forEach(item => {
                item.onl_distr_date = that.ctx.helper.filteTime(item.onl_distr_date).substring(0, 10);
                item.onl_lotwiner_stpub_date = that.ctx.helper.filteTime(item.onl_lotwiner_stpub_date).substring(0, 10);
            })
        } else if (region == 'HK') {
            newStockths = [
                {name: '股票代码', field: 'symbol'},
                {name: '上市日期', field: 'list_date'},
                {name: '招股价下限', field: 'issprice_min'},
                {name: '招股价上限', field: 'issprice_max'},
            ]
            newStock_data = data.items;
            newStock_data.forEach(item => {
                item.list_date = that.ctx.helper.filteTime(item.list_date).substring(0, 10);
            })
        } else {
            newStockths = [
                {name: '股票代码', field: 'symbol'},
                {name: '上市日期', field: 'list_date'},
                {name: '股本', field: 'shares'},
                {name: '招股价下限', field: 'issprice_min'},
                {name: '招股价上限', field: 'issprice_max'},
            ]
            newStock_data = data.items;
            newStock_data.forEach(item => {
                item.list_date = that.ctx.helper.filteTime(item.list_date).substring(0, 10);
                item.shares = that.ctx.helper.unitConverter(item.shares);
            })
        }
        const obj = {
            newStockths: newStockths,
            newStock_data: newStock_data
        }
        return obj;
    }

    async marketsort(region) {
        const ctx = this.ctx;
        const that = this;
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 0, '');
        //amount（成交额），percent（涨跌幅），volume（成交量）
        const data = [
            {name: '涨跌幅', field: 'percent'},
            {name: '成交量', field: 'volume'},
            {name: '成交额', field: 'amount'}
        ]
        for (let i = 0; i < data.length; i++) {
            let getJsonUrl = `https://xueqiu.com/service/v5/stock/screener/quote/list?type=${region}&order_by=${data[i].field}&order=desc&size=10&page=1&_=${Date.now()}`;
            data[i].data = await that.getJsons(getJsonUrl, options);
            data[i].data.list.forEach(item => {
                item.volume = that.ctx.helper.unitConverter(item.volume);
                item.amount = that.ctx.helper.unitConverter(item.amount);
            })
        }
        return data;
    }

    async getSortList(condition) {
        const ctx = this.ctx;
        const that = this;
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 0, '');
        return new Promise((resolve, reject) => {
            try {
                request(options, function (err, res, body) {
                    if (!err && res.statusCode == 200) {
                        const html = myIconv.decode(body, myEcoding);
                        const $ = myCheerio.load(html, {decodeEntities: false})
                        const third_nav = $('div.third-nav');
                        let data = [];
                        third_nav.each((i, e) => {
                            const firstText = $(e).find('li').first().children('a').text();
                            if (firstText == condition) {
                                $(e).find('li').each((ci, ce) => {
                                    let obj;
                                    if (condition == "创业板涨幅") {
                                        const str = $(ce).children('a').attr('href');
                                        obj = {
                                            name: $(ce).children('a').text(),
                                            data_type: $(ce).children('a').attr('data-type'),
                                            order_by: str.substring(str.lastIndexOf('=') + 1, str.length),
                                            order: str.substring(str.indexOf('order') + 6, str.lastIndexOf('&')),
                                        }
                                    } else {
                                        obj = {
                                            name: $(ce).children('a').text(),
                                            data_level2code: $(ce).children('a').attr('data-level2code')
                                        }
                                    }
                                    data.push(obj)
                                })
                            }
                        })
                        resolve(data)
                    } else {
                        reject(err)
                    }
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    async debtmarket(category, page) {
        const ctx = this.ctx;
        const that = this;
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
        const staticThs = [
            {name: '名称', field: 'name'},
            {name: '代码', field: 'symbol'},
            {name: '当前价', field: 'current'},
            {name: '涨跌幅', field: 'percent'}
        ];
        const arr = [
            {
                name: '可转债',
                value: 'permitCover',
                JsonUrl: `https://xueqiu.com/service/v5/stock/screener/quote/list?page=${page}&size=30&order=desc&orderby=percent&order_by=percent&exchange=CN&market=CN&industry=%E5%8F%AF%E8%BD%AC%E5%80%BA&type=convert&_=${Date.now()}`,
                ths: [...staticThs,
                    {name: '正股简称', field: 'underlying_name'},
                    {name: '正股价', field: 'underlying_current'},
                    {name: '正股涨跌幅', field: 'underlying_percent'},
                    {name: '转股价', field: 'conversion_price'},
                    {name: '转股价值', field: 'conversion_value'},
                    {name: '溢价率', field: 'premium_rate'},
                    {name: '税前收益', field: 'benefit_before_tax'},
                    {name: '税后收益', field: 'benefit_after_tax'},
                    {name: '正股净资产', field: 'underlying_navps'},
                    {name: '正股市净率', field: 'underlying_pb'},
                    {name: '转债占比', field: 'convert_bond_ratio'},
                    {name: '转债规模', field: 'total_issue_scale'},
                    {name: '剩余年限(年)', field: 'remain_year'},
                    {name: '具体利率', field: 'interest_memo'},
                    {name: '到期时间', field: 'maturity_time'}
                ],
                fn: function (list) {
                    for (let i = 0; i < list.length; i++) {
                        const item = list[i];
                        item.premium_rate = item.premium_rate + '%';
                        item.convert_bond_ratio = item.convert_bond_ratio + '%';
                        item.total_issue_scale = that.ctx.helper.unitConverter(item.total_issue_scale);
                        if (item.maturity_time) item.maturity_time = that.ctx.helper.filteTime(item.maturity_time).substring(0, 10);
                        item.underlying_percent = item.underlying_percent + '%';
                        item.percent = item.percent + '%';
                    }
                    return list;
                }
            },
            {
                name: '国债',
                value: 'country',
                JsonUrl: `https://xueqiu.com/service/v5/stock/screener/quote/list?page=${page}&size=30&order=desc&orderby=percent&order_by=percent&exchange=CN&market=CN&industry=%E5%9B%BD%E5%80%BA&type=national&_=${Date.now()}`,
                ths: [...staticThs,
                    {name: '涨跌额', field: 'chg'},
                    {name: '成交量', field: 'volume'},
                    {name: '剩余年限(年)', field: 'termtomaturity'},
                    {name: '票面利息', field: 'coupon_rate'},
                    {name: '债项评级', field: 'rating'},
                    {name: '票面利息', field: 'coupon_rate'},
                    {name: '到期时间', field: 'maturity_time'},
                ],
                fn: function (list) {
                    for (let i = 0; i < list.length; i++) {
                        const item = list[i];
                        item.percent = item.percent + '%';
                        if (item.volume) item.volume = that.ctx.helper.unitConverter(item.volume);
                        if (item.maturity_time) item.maturity_time = that.ctx.helper.filteTime(item.maturity_time).substring(0, 10);
                    }
                    return list;
                }
            },
            {
                name: '企债',
                value: 'company',
                JsonUrl: `https://xueqiu.com/service/v5/stock/screener/quote/list?page=${page}&size=30&order=desc&orderby=percent&order_by=percent&exchange=CN&market=CN&industry=%E4%BC%81%E5%80%BA&type=corp&_=${Date.now()}`,
                ths: [...staticThs,
                    {name: '成交量', field: 'volume'},
                    {name: '剩余年限(年)', field: 'termtomaturity'},
                    {name: '票面利息', field: 'coupon_rate'},
                    {name: '债项评级', field: 'rating'},
                    {name: '票面利息', field: 'coupon_rate'},
                    {name: '到期时间', field: 'maturity_time'},],
                fn: function (list) {
                    for (let i = 0; i < list.length; i++) {
                        const item = list[i];
                        item.percent = item.percent + '%';
                        if (item.volume) item.volume = that.ctx.helper.unitConverter(item.volume);
                        if (item.maturity_time) item.maturity_time = that.ctx.helper.filteTime(item.maturity_time).substring(0, 10);
                    }
                    return list;
                }
            },
            {
                name: '回购',
                value: 'tradeIn',
                JsonUrl: `https://xueqiu.com/service/v5/stock/screener/quote/list?page=${page}&size=30&order=desc&orderby=name&order_by=percent&exchange=CN&market=CN&industry=%E5%9B%9E%E8%B4%AD&flag=&type=repurchase&_=${Date.now()}`,
                ths: [...staticThs,
                    {name: '当前利率', field: 'current'},
                    {name: '当前下单成交日', field: 'trading_time'},
                    {name: '资金可用日', field: 'actual_time'},
                    {name: '资金借用天数', field: 'trading_days'},
                    {name: '资金可取日(逆)', field: 'withdrawable_time'},
                    {name: '每十万收益(逆)', field: 'net_profit'},
                    {name: '日均收益(逆)', field: 'net_profit_day'},
                    {name: '日年化收益(逆)', field: 'net_profit_yield'},
                    {name: '每十万成本(正)', field: 'net_cost'},
                    {name: '日均成本(正)', field: 'net_cost_day'},
                    {name: '日年化成本(正)', field: 'net_cost_yield'},
                    {name: '每十万成本(正)', field: 'net_cost'},
                ],
                fn: function (list) {
                    for (let i = 0; i < list.length; i++) {
                        const item = list[i];
                        item.日年化收益 = item.日年化收益 + '%';
                        item.net_cost_yield = item.net_cost_yield + '%';
                        item.actual_time = that.ctx.helper.filteTime(item.actual_time).substring(0, 10);
                        item.withdrawable_time = that.ctx.helper.filteTime(item.withdrawable_time).substring(0, 10);
                        item.trading_time = that.ctx.helper.filteTime(item.trading_time).substring(0, 10);
                    }
                    return list;
                }
            },
        ]
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 0, '');
        return new Promise((resolve, reject) => {
            try {
                arr.forEach(async item => {
                    if (item.value == category) {
                        item.stockdata = await that.getJsons(item.JsonUrl, options);
                        delete item.JsonUrl;
                        if (item.fn) item.stockdata.list = item.fn(item.stockdata.list);
                        resolve(item);
                    }
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    async fundmarket(category, page) {
        const ctx = this.ctx;
        const that = this;
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
        const staticThs = [
            {name: '名称', field: 'name'},
            {name: '代码', field: 'symbol'},
            {name: '单位净值', field: 'unit_nav'},
            {name: '累计净值', field: 'acc_unit_nav'},
            {name: '涨跌幅', field: 'percent'},
            {name: '涨跌额', field: 'chg'},
            {name: '评级', field: 'rating'},
        ];
        const fn = function (list) {
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                item.percent = item.percent + '%';
            }
            return list;
        }
        const arr = [
            {
                name: '分级基金',
                value: 'classification',
                JsonUrl: `https://xueqiu.com/service/v5/stock/screener/fund/list?type=11&parent_type=1&order=desc&order_by=percent&page=${page}&size=30&_=${Date.now()}`,
                ths: staticThs,
                fn: fn
            },
            {
                name: '货币型',
                value: 'currency',
                JsonUrl: `https://xueqiu.com/service/v5/stock/screener/fund/list?type=12&parent_type=1&order=desc&order_by=current&page=${page}&size=30&_=${Date.now()}`,
                ths: [
                    {name: '名称', field: 'name'},
                    {name: '代码', field: 'symbol'},
                    {name: '市价', field: 'current'},
                    {name: '涨跌幅', field: 'percent'},
                    {name: '涨跌额', field: 'chg'},
                    {name: '更新日期', field: 'timestamp'},
                ],
                fn: function (list) {
                    for (let i = 0; i < list.length; i++) {
                        const item = list[i];
                        item.percent = item.percent + '%';
                        item.timestamp = that.ctx.helper.filteTime(item.timestamp).substring(0, 10);
                    }
                    return list;
                }
            },
            {
                name: '股票型',
                value: 'stocket',
                JsonUrl: `https://xueqiu.com/service/v5/stock/screener/fund/list?type=13&parent_type=1&order=desc&order_by=percent&page=${page}&size=30&_=${Date.now()}`,
                ths: staticThs,
                fn: fn
            },
            {
                name: '债券型',
                value: 'debt',
                JsonUrl: `https://xueqiu.com/service/v5/stock/screener/fund/list?type=14&parent_type=1&order=desc&order_by=percent&page=${page}&size=30&_=${Date.now()}`,
                ths: staticThs,
                fn: fn
            },
            {
                name: '混合型',
                value: 'mixture',
                JsonUrl: `https://xueqiu.com/service/v5/stock/screener/fund/list?type=15&parent_type=1&order=desc&order_by=percent&page=${page}&size=30&_=${Date.now()}`,
                ths: staticThs,
                fn: fn
            },
            {
                name: 'QDII基金',
                value: 'QDII',
                JsonUrl: `https://xueqiu.com/service/v5/stock/screener/fund/list?type=16&parent_type=1&order=desc&order_by=percent&page=${page}&size=30&_=${Date.now()}`,
                ths: staticThs,
                fn: fn
            },
            {
                name: '指数型基金',
                value: 'figure',
                JsonUrl: `https://xueqiu.com/service/v5/stock/screener/fund/list?type=17&parent_type=1&order=desc&order_by=percent&page=${page}&size=30&_=${Date.now()}`,
                ths: staticThs,
                fn: fn
            },
            {
                name: 'ETF',
                value: 'ETF',
                JsonUrl: `https://xueqiu.com/service/v5/stock/screener/fund/list?type=18&parent_type=1&order=desc&order_by=percent&page=${page}&size=30&_=${Date.now()}`,
                ths: staticThs,
                fn: fn
            },
            {
                name: 'LOF',
                value: 'LOF',
                JsonUrl: `https://xueqiu.com/service/v5/stock/screener/fund/list?type=19&parent_type=1&order=desc&order_by=percent&page=${page}&size=30&_=${Date.now()}`,
                ths: staticThs,
                fn: fn
            },
            {
                name: 'FOF',
                value: 'FOF',
                JsonUrl: `https://xueqiu.com/service/v5/stock/screener/fund/list?type=20&parent_type=1&order=desc&order_by=percent&page=${page}&size=30&_=${Date.now()}`,
                ths: staticThs,
                fn: fn
            },
        ]
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 0, '');
        return new Promise((resolve, reject) => {
            try {
                arr.forEach(async item => {
                    if (item.value == category) {
                        item.stockdata = await that.getJsons(item.JsonUrl, options);
                        delete item.JsonUrl;
                        if (item.fn) item.stockdata.list = item.fn(item.stockdata.list);
                        resolve(item);
                    }
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    async usmarket(category, page, addition) {
        const ctx = this.ctx;
        const that = this;
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
        const staticThs = [
            {name: '股票名称', field: 'name'},
            {name: '股票代码', field: 'symbol'},
            {name: '当前价', field: 'current'},
            {name: '涨跌额', field: 'chg'},
            {name: '涨跌幅', field: 'percent'},
            {name: '年初至今', field: 'current_year_percent'},
            {name: '成交量', field: 'volume'},
            {name: '成交额', field: 'amount'},
            {name: '换手率', field: 'turnover_rate'},
            {name: '市盈率(TTM)', field: 'pe_ttm'},
            {name: '股息率', field: 'dividend_yield'},
            {name: '市值', field: 'market_capital'}
        ];
        const fn = function (list) {
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                item.percent = item.percent + '%';
                item.current_year_percent = item.current_year_percent + '%';
                item.volume = that.ctx.helper.unitConverter(item.volume);
                item.amount = that.ctx.helper.unitConverter(item.amount);
                item.turnover_rate = item.turnover_rate + '%';
                item.dividend_yield = item.dividend_yield + '%';
                item.market_capital = that.ctx.helper.unitConverter(item.market_capital);
            }
            return list;
        }
        const arr = [
            {
                name: '美股一览',
                value: 'us',
                JsonUrl: `https://xueqiu.com/service/v5/stock/screener/quote/list?page=${page}&size=30&order=desc&orderby=percent&order_by=percent&market=US&type=us&_=${Date.now()}`,
                ths: staticThs,
                fn: fn
            },
            {
                name: 'GICS行业',
                value: 'gisc',
                JsonUrl: `https://xueqiu.com/service/v5/stock/screener/quote/list?page=${page}&size=30&order=desc&order_by=percent&exchange=US&market=US&ind_code=${addition.encode}&_=${Date.now()}`,
                ths: staticThs,
                fn: fn
            },
            {
                name: '明星股',
                value: 'famous',
                JsonUrl: `https://xueqiu.com/service/v5/stock/screener/quote/list?page=${page}&size=30&order=desc&orderby=percent&order_by=percent&market=US&type=us_star&_=${Date.now()}`,
                ths: staticThs,
                fn: fn
            },
            {
                name: '中国概念股',
                value: 'zggng',
                JsonUrl: `https://xueqiu.com/service/v5/stock/screener/quote/list?page=${page}&size=30&order=desc&orderby=percent&order_by=percent&market=US&type=us_china&_=${Date.now()}`,
                ths: staticThs,
                fn: fn
            },
            {
                name: '上市预告',
                value: 'ssyg',
                JsonUrl: `https://xueqiu.com/service/v5/stock/preipo/us/list?order_by=list_date&order=asc&page=${page}&size=10&type=unlisted&_=${Date.now()}`,
                ths: [
                    {name: '股票名称', field: 'name'},
                    {name: '股票代码', field: 'symbol'},
                    {name: '上市日期', field: 'list_date'},
                    {name: '股本（百万）', field: 'shares'},
                    {name: '招股价下限', field: 'issprice_min'},
                    {name: '招股价上限', field: 'issprice_max'},
                ],
                fn: function (list) {
                    for (let i = 0; i < list.length; i++) {
                        const item = list[i];
                        item.list_date = that.ctx.helper.filteTime(item.list_date).substring(0, 10);
                        item.shares = that.ctx.helper.unitConverter(item.shares);
                    }
                    return list;
                }
            },
            {
                name: '新上市公司',
                value: 'xssgs',
                JsonUrl: `https://xueqiu.com/service/v5/stock/preipo/us/list?page=${page}&size=30&order=desc&order_by=list_date&market=US&type=listed&_=${Date.now()}`,
                ths: [
                    {name: '股票名称', field: 'name'},
                    {name: '股票代码', field: 'symbol'},
                    {name: '上市日期', field: 'list_date'},
                    {name: '股本（百万）', field: 'shares'},
                    {name: '上市价', field: 'issue_price'},
                    {name: '现价', field: 'current'},
                    {name: '涨跌额', field: 'chg'},
                    {name: '涨跌幅', field: 'percent'},
                ],
                fn: function (list) {
                    for (let i = 0; i < list.length; i++) {
                        const item = list[i];
                        item.list_date = that.ctx.helper.filteTime(item.list_date).substring(0, 10);
                        item.shares = that.ctx.helper.unitConverter(item.shares);
                        if (item.percent) item.percent = item.percent + '%';
                    }
                    return list;
                }
            },
        ]
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 0, '');
        return new Promise((resolve, reject) => {
            try {
                arr.forEach(async item => {
                    if (item.value == category) {
                        item.stockdata = await that.getJsons(item.JsonUrl, options);
                        delete item.JsonUrl;
                        if (item.value == 'gisc') item.options = (await that.getJsons(`https://xueqiu.com/service/screener/industries?category=US&_=${Date.now()}`, options)).industries
                        if (category == 'ssyg' || category == 'xssgs') {
                            item.stockdata.list = item.stockdata.items;
                            delete item.stockdata.items;
                        }
                        if (item.fn) item.stockdata.list = item.fn(item.stockdata.list);
                        resolve(item);
                    }
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    async hkmarket(category, page, addition) {
        const ctx = this.ctx;
        const that = this;
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
        const staticThs = [
            {name: '股票名称', field: 'name'},
            {name: '股票代码', field: 'symbol'},
            {name: '当前价', field: 'current'},
            {name: '涨跌额', field: 'chg'},
            {name: '涨跌幅', field: 'percent'},
            {name: '年初至今', field: 'current_year_percent'},
            {name: '成交量', field: 'volume'},
            {name: '成交额', field: 'amount'},
            {name: '换手率', field: 'turnover_rate'},
            {name: '市盈率(TTM)', field: 'pe_ttm'},
            {name: '股息率', field: 'dividend_yield'},
            {name: '市值', field: 'market_capital'}
        ];
        const fn = function (list) {
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                item.percent = item.percent + '%';
                item.current_year_percent = item.current_year_percent + '%';
                item.volume = that.ctx.helper.unitConverter(item.volume);
                item.amount = that.ctx.helper.unitConverter(item.amount);
                item.turnover_rate = item.turnover_rate + '%';
                item.dividend_yield = item.dividend_yield + '%';
                item.market_capital = that.ctx.helper.unitConverter(item.market_capital);
            }
            return list;
        }
        const arr = [
            {
                name: '港股一览',
                value: 'hk',
                JsonUrl: `https://xueqiu.com/service/v5/stock/screener/quote/list?page=${page}&size=30&order=desc&orderby=percent&order_by=percent&market=HK&type=hk&is_delay=true&_=${Date.now()}`,
                ths: staticThs,
                fn: fn
            },
            {
                name: '恒生企业',
                value: 'hsqy',
                JsonUrl: `https://xueqiu.com/service/v5/stock/screener/quote/list?page=1&size=30&order=desc&order_by=percent&exchange=HK&market=HK&ind_code=${addition.encode}&is_delay=true&_=${Date.now()}`,
                ths: staticThs,
                fn: fn
            },
            {
                name: '新股上市',
                value: 'xgss',
                JsonUrl: `https://xueqiu.com/service/v5/stock/preipo/hk/query?page=1&size=10&order=asc&order_by=list_date&type=unlisted&_=${Date.now()}}`,
                ths: [
                    {name: '股票名称', field: 'name'},
                    {name: '股票代码', field: 'symbol'},
                    {name: '上市日期', field: 'list_date'},
                    {name: '招股价下限', field: 'issprice_min'},
                    {name: '招股价上限', field: 'issprice_max'},
                ],
                fn: function (list) {
                    for (let i = 0; i < list.length; i++) {
                        const item = list[i];
                        item.list_date = that.ctx.helper.filteTime(item.list_date).substring(0, 10);
                    }
                    return list;
                }
            },
        ]
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 0, '');
        return new Promise((resolve, reject) => {
            try {
                arr.forEach(async item => {
                    if (item.value == category) {
                        item.stockdata = await that.getJsons(item.JsonUrl, options);
                        delete item.JsonUrl;
                        if (item.value == 'hsqy') item.options = (await that.getJsons(`https://xueqiu.com/service/screener/industries?category=HK&_=${Date.now()}`, options)).industries
                        if (category == 'xgss') {
                            item.stockdata.list = item.stockdata.items;
                            delete item.stockdata.items;
                        }
                        if (item.fn) item.stockdata.list = item.fn(item.stockdata.list);
                        resolve(item);
                    }
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    async shmarket(category, page, addition) {
        const ctx = this.ctx;
        const that = this;
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
        const staticThs = [
            {name: '股票名称', field: 'name'},
            {name: '股票代码', field: 'symbol'},
            {name: '当前价', field: 'current'},
            {name: '涨跌额', field: 'chg'},
            {name: '涨跌幅', field: 'percent'},
            {name: '年初至今', field: 'current_year_percent'},
            {name: '成交量', field: 'volume'},
            {name: '成交额', field: 'amount'},
            {name: '换手率', field: 'turnover_rate'},
            {name: '市盈率(TTM)', field: 'pe_ttm'},
            {name: '股息率', field: 'dividend_yield'},
            {name: '市值', field: 'market_capital'}
        ];
        const fn = function (list) {
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                item.percent = item.percent + '%';
                item.current_year_percent = item.current_year_percent + '%';
                item.volume = that.ctx.helper.unitConverter(item.volume);
                item.amount = that.ctx.helper.unitConverter(item.amount);
                item.turnover_rate = item.turnover_rate + '%';
                item.dividend_yield = item.dividend_yield + '%';
                item.market_capital = that.ctx.helper.unitConverter(item.market_capital);
            }
            return list;
        }
        const arr = [
            {
                name: '泸深一览',
                value: 'sh',
                JsonUrl: `https://xueqiu.com/service/v5/stock/screener/quote/list?page=${page}&size=30&order=desc&orderby=percent&order_by=percent&market=CN&type=sh_sz&_=${Date.now()}`,
                ths: staticThs,
                fn: fn
            },
            {
                name: '科创板',
                value: 'kcb',
                JsonUrl: `https://xueqiu.com/service/v5/stock/screener/quote/list?page=${page}&size=30&order=desc&order_by=percent&exchange=CN&market=CN&type=kcb&_=${Date.now()}`,
                ths: staticThs,
                fn: fn
            },
            {
                name: '基础分类',
                value: 'jcfl',
                JsonUrl: `https://xueqiu.com/service/v5/stock/screener/quote/list?page=${page}&size=30&order=desc&order_by=percent&exchange=CN&market=CN&ind_code=${addition.data_level2code}&_=${Date.now()}`,
                ths: staticThs,
                fn: fn

            },
            {
                name: '排行',
                value: 'ph',
                JsonUrl: `https://xueqiu.com/service/v5/stock/screener/quote/list?page=${page}&size=30&order=${addition.order}&order_by=${addition.order_by}&exchange=CN&market=CN&type=${addition.data_type}&_=${Date.now()}`,
                ths: staticThs,
                fn: fn
                // html:await that.getSortList()
            },
            {
                name: '新股上市',
                value: 'xgss',
                JsonUrl: `https://xueqiu.com/service/v5/stock/preipo/cn/query?type=subscribe&order_by=onl_subbeg_date&order=asc&page=${page}&size=10&_=${Date.now()}`,
                ths: [
                    {name: '股票名称', field: 'name'},
                    {name: '申购代码', field: 'onl_subcode'},
                    {name: '申购日期', field: 'onl_distr_date'},
                    {name: '网上发行量(万)', field: 'onl_actissqty'},
                    {name: '申购上限(万)', field: 'onl_sub_maxqty'},
                    {name: '预计发行量（万）', field: 'actissqty'},
                    {name: '发行价', field: 'iss_price'},
                    {name: '中签号公布日', field: 'onl_lotwiner_stpub_date'},
                ],
                fn: function (list) {
                    for (let i = 0; i < list.length; i++) {
                        const item = list[i];
                        item.onl_distr_date = that.ctx.helper.filteTime(item.onl_distr_date).substring(0, 10);
                        item.onl_lotwiner_stpub_date = that.ctx.helper.filteTime(item.onl_lotwiner_stpub_date).substring(0, 10);
                    }
                    return list;
                }
            },
            {
                name: '龙虎榜',
                value: 'lhb',
                // JsonUrl: `https://xueqiu.com/service/v5/stock/hq/longhu?date=${new Date(new Date().toLocaleDateString()).getTime() + 10}&_=${Date.now()}`,
                JsonUrl: `https://xueqiu.com/service/v5/stock/hq/longhu?date=${addition.start_date}&_=${addition.end_date}`,
                ths: [
                    {name: '股票名称', field: 'name'},
                    {name: '收盘价', field: 'close'},
                    {name: '涨跌幅', field: 'percent'},
                    {name: '成交量', field: 'volume'},
                    {name: '成交额', field: 'amount'},
                    {name: '上榜原因', field: 'type_name'},
                ],
                fn: fn
            },
            {
                name: 'AH股溢价',
                value: 'ahyj',
                JsonUrl: `https://xueqiu.com/service/v5/stock/ah/compare?page=${page}&order=desc&orderby=price_ratio&order_by=premium&size=30&_=${Date.now()}`,
                fn: function (list) {
                    for (let i = 0; i < list.length; i++) {
                        const item = list[i];
                        item.percent_cn = item.percent_cn + '%';
                        item.percent_hk = item.percent_hk + '%';
                    }
                    return list;
                }

            },
            {
                name: '内部交易',
                value: 'nbjy',
                JsonUrl: `https://xueqiu.com/service/v5/stock/f10/cn/skholderchg?size=10&page=${page}&extend=true${addition.code}&_=${Date.now()}`,
                ths: [
                    {name: '股票名称', field: 'name'},
                    {name: '股票代码', field: 'symbol'},
                    {name: '变动日期', field: 'chg_date'},
                    {name: '变动人', field: 'share_changer_name'},
                    {name: '变动股数', field: 'chg_shares_num'},
                    {name: '成交均价', field: 'trans_avg_price'},
                    {name: '变动后持股数', field: 'daily_shares_balance_otd'},
                    {name: '与董监高关系', field: 'rr_of_chgr_and_manage'},
                    {name: '董监高职务', field: 'duty'},
                ],
                fn: function (list) {
                    for (let i = 0; i < list.length; i++) {
                        const item = list[i];
                        item.chg_date = that.ctx.helper.filteTime(item.chg_date).substring(0, 10);
                    }
                    return list;
                }
            },
        ]
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 0, '');
        return new Promise((resolve, reject) => {
            try {
                arr.forEach(async item => {
                    if (item.value == category) {
                        item.stockdata = await that.getJsons(item.JsonUrl, options);
                        delete item.JsonUrl;
                        if (item.value == 'ph') {
                            item.options = await that.getSortList("创业板涨幅");
                        } else if (item.value == 'jcfl') {
                            item.options = await that.getSortList("半导体");
                        } else if (item.value == 'xgss' || item.value == 'lhb' || item.value == 'ahyj' || item.value == 'nbjy') {
                            item.stockdata.list = item.stockdata.items;
                            delete item.stockdata.items;
                        }
                        if (item.fn) item.stockdata.list = item.fn(item.stockdata.list);
                        resolve(item);
                    }
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    async groupdetail(cube_symbol,cube_id,market,rb_id) {
        const {ctx} = this;
        const that = this;
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ":" + JSON.parse(reply).port;
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 0, '');
        const fn=async function (options,JsonsUrl) {
            options.url=JsonsUrl;
            return new Promise((resolve, reject) => {
                try {
                    request(options, function (err, res, body) {
                        if (!err && res.statusCode == 200) {
                            resolve(JSON.parse(body.toString()));
                        } else {
                            reject(err)
                        }
                    })
                } catch (e) {
                    reject(e)
                }
            })
        }
        const echartsJsons = {
            line: `https://xueqiu.com/cubes/nav_daily/all.json?cube_symbol=${cube_symbol}&since=${Date.now()-24*60*60*1000*90}&until=${Date.now()}`,//折线图
            pie: `https://xueqiu.com/cubes/rank/summary.json?symbol=ZH1416830&ua=web`,//业绩评级，
            rank_percent: `https://xueqiu.com/cubes/data/rank_percent.json?cube_symbol=${cube_symbol}&cube_id=${cube_id}&market=${market}&dimension=annual&_=${Date.now()}`,//跑赢组合
            orign: `https://xueqiu.com/cubes/rebalancing/show_origin.json?rb_id=${rb_id}&cube_symbol=${cube_symbol}`,//最新调仓
            detail: ''//详细仓位，cheerio爬取
        }
        const obj={
            linedata:await fn(options,echartsJsons.line),
            pieedata:await fn(options,echartsJsons.pie),
            rank_percentdata:await fn(options,echartsJsons.rank_percent),
            origndata:await fn(options,echartsJsons.orign)
        }
        return obj;
    }

    async grouphotoday(page) {
        const {ctx} = this;
        const that = this;
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ":" + JSON.parse(reply).port;
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 0, '');

        options.url = `https://xueqiu.com/cubes/discover/rank/cube/list.json?category=14&page=${page}&count=20`
        return new Promise((resolve, reject) => {
            try {
                request(options, function (err, res, body) {
                    if (!err && res.statusCode == 200) {
                        const data = JSON.parse(body.toString());
                        for (let i = 0; i < data.list.length; i++) {
                            const item = data.list[i];
                            item.owner = {
                                screen_name: item.owner.screen_name,
                                profile_image_url: item.owner.profile_image_url,
                                photo_domain: item.owner.photo_domain,
                            }
                            data.list[i] = {
                                id: item.id,
                                name: item.name,
                                symbol: item.symbol,
                                market: item.market,
                                total_gain: item.total_gain,
                                daily_gain: item.daily_gain,//日
                                monthly_gain: item.monthly_gain,//月
                                net_value: item.net_value,//净值
                                description: item.description,
                                last_user_rb_gid: item.last_user_rb_gid,
                                owner: item.owner,
                                follower_count: item.follower_count,
                                from: `https://xueqiu.com/P/${item.symbol}`
                            };
                        }
                        const obj = {
                            list: data.list,
                            maxPage: data.maxPage,
                            totalCount: data.totalCount
                        }
                        resolve(obj);
                    } else {
                        reject(err)
                    }
                })
            } catch (e) {
                reject(e)
            }
        })
    }
}

module.exports = MarketService
