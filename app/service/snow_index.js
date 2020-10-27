const Service = require('egg/index').Service;
const request = require('request');
const Promise = require('bluebird');
const myIconv = require('iconv-lite/lib/index');
const myCheerio = require('cheerio');
const fs = require('fs');
const myEcoding = 'UTF-8';
const myURL = 'https://xueqiu.com';
const superagent = require('superagent');
const path = require('path');
const sd = require('silly-datetime');
const timeout = 8000;
const size = 15;
const sleeptime = 3000;
const getIpApiURL = 'http://http.tiqu.alicdns.com/getip3?num=1&type=2&pro=&city=0&yys=0&port=1&time=1&ts=1&ys=1&cs=1&lb=1&sb=0&pb=4&mr=1&regions=&gm=4';

class NewsService extends Service {
    async videofile(){
        return new Promise(resolve=>{
            fs.readFile(path.resolve(__dirname,"../public/video/yi.mkv"), function (err, data) {
                if (err) {
                    throw err;
                }
                console.log(data)
                resolve(data)
            });
        })
    }
    async NewDetail(options) {
        return new Promise((resolve, reject) => {
            try {
                request(options, function (err, res, body) {
                    if (!err && res.statusCode == 200) {
                        const html = myIconv.decode(body, myEcoding);
                        const $ = myCheerio.load(html);
                        const details = $('div.article__bd__detail ')
                            .children('p');
                        let text = '';
                        let form = '';
                        details.each(function (i, e) {
                            if (i == 0) {
                                form = $(e)
                                    .text();
                            } else {
                                text = text + $(e)
                                    .text();
                            }
                        });
                        if (text == '') {
                            text = $('div.article__bd__detail')
                                .text();
                            let str = text.substring(text.indexOf('来源'), text.indexOf('）') + 1);
                            text = text.replace(str, '');
                        }
                        const detail = {
                            from: form,
                            text: text
                        };
                        //console.log(detail)
                        resolve(detail);
                    } else {
                        reject(err);
                    }
                });
            } catch (e) {
                throw e;
            }
        });
    }

    async isexisit(id, table, new_id) {
        const result = await this.app.mysql.query(`select count(*) as mybool from ${table} where ${new_id} = ?`, [id]);
        const mybool = result[0].mybool;
        //console.log(id, '存在：' + mybool);
        return mybool;
    }

    async savedatailtxt(text) {
        //console.log('准备写入数据');
        return new Promise((resolve, reject) => {
            // path.join(__dirname,'../public/static/index/snowhotnew/')+
            const filename = Date.now() + '.txt';
            const file = path.join(__dirname, '../public', `/${filename}`);
            fs.writeFile(file, text, function (err) {
                if (err) throw err;
                //console.log(file, '数据写入成功');
                resolve(file);
            });
        });
    }

    async readnewfile(url) {
        return new Promise((resolve, reject) => {
            fs.readFile(url, function (err, data) {
                if (err) throw err;
                resolve(data.toString());
            });
        });
    }

    async gethotAlldata(page,size) {
        const count = await this.app.mysql.query(`select count(*) from index_snowhotnew`);
        const result = await this.app.mysql.select('index_snowhotnew', {
            orders: [['created_at', 'desc']],
            limit:size,
            offset: page
        });
        let realdata = [];
        for (let i = 0; i < result.length; i++) {
            const detail = await this.app.mysql.select('index_snowhotnew', {
                where: {article_id: result[i].article_id},
                columns: ['detail', 'created_at'],
            });
            const realdetail = await this.readnewfile(detail[0].detail);
            let obj = result[i];
            obj.detail = realdetail;
            obj.created_at = this.ctx.helper.filteTime(parseInt(obj.created_at));
            realdata[i] = obj;
        }
        const obj={
            data:realdata,
            count:count[0]['count(*)']
        }
        return obj;
    }

    async upnewhotdata(options) {
        const that = this;
        return new Promise((resolve, reject) => {
            try {
                request(options, async function (err, res, body) {
                    if (!err && res.statusCode == 200) {
                        const html = myIconv.decode(body, myEcoding);
                        const JsonData = JSON.parse(html);
                        const next_id = JsonData.next_id;
                        const items = JsonData.items;
                        let bool = 1;
                        for (let i = 0; i < JsonData.items.length; i++) {
                            let obj = {};
                            const original = items[i].original_status;
                            obj.article_id = items[i].id;
                            obj.title = original.title;
                            obj.description = original.description;
                            obj.url = `${myURL}${original.target}`;
                            obj.user = original.user.screen_name;
                            obj.created_at = original.created_at;
                            options.url = obj.url;
                            bool = await that.isexisit(obj.article_id, 'index_snowhotnew', 'article_id');
                            if (bool == 0) {
                                const detail = await that.NewDetail(options);
                                const dir = await that.savedatailtxt(detail.text);
                                obj.detail = dir;
                                obj.from = detail.from;
                                await that.app.mysql.insert('index_snowhotnew', obj);
                            } else {
                                //console.log(obj.article_id, '记录已存在,结束更新');
                                continue;
                            }
                        }
                        resolve(next_id);
                    }
                });
            } catch (e) {
                throw err;
            }
        });

    }

    async getmoredata(options, max_id, size, sleeptime, time) {
        const ctx = this.ctx;
        if (time == 0) {
            return 'ok';
        }
        let getJsonUrl = `https://xueqiu.com/statuses/hot/listV2.json?since_id=-1&max_id=${max_id}&size=${size}`;
        console.log('暂停3秒,剩余执行次数：' + time);
        await ctx.helper.sleep(sleeptime);
        console.log(getJsonUrl, time);
        options.url = getJsonUrl;
        this.upnewhotdata(options);
        const next_id = max_id - size;
        const next_time = time - 1;
        return this.getmoredata(options, next_id, size, sleeptime, next_time);
    }

    async SnowHotNew() {
        const ctx = this.ctx;
        const that = this;
        const testime = 2;
        let max_id = -1;
        let getJsonUrl = `https://xueqiu.com/statuses/hot/listV2.json?since_id=-1&max_id=${max_id}&size=${size}`;
        return new Promise(async (resolve) => {
            const reply = await that.app.redis.get('ipJsons');
            const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
            const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 1, getJsonUrl);
            /*const options = await ctx.helper.getAgentIps(getIpApiURL)
                .then(async (proxy) => {
                    return await ctx.helper.getWebCookie(myURL, proxy, timeout, 1, getJsonUrl);
                });*/
            that.upnewhotdata(options)
                .then(async function (max_id) {
                    that.getmoredata(options, max_id, size, sleeptime, testime)
                    const text = '更新今日热帖新闻';
                    resolve(text);
                });
        })
    }

    async upSevenMultiptDaydata(options, time, max_id, size) {
        const that = this;
        console.log('暂停3秒,剩余执行次数：' + time);
        if (time == 0) {
            return
        }
        try {
            request(options, async function (err, res, body) {
                if (!err && res.statusCode == 200) {
                    const html = myIconv.decode(body, myEcoding);
                    const JsonData = JSON.parse(html);
                    const next_max_id = JsonData.next_max_id;
                    const items = JsonData.items;
                    let bool = 1;
                    for (let i = 0; i < JsonData.items.length; i++) {
                        let obj = {};
                        obj.new_id = items[i].id;
                        obj.text = items[i].text;
                        obj.target = items[i].target;
                        obj.created_at = items[i].created_at;
                        obj.reply_count = items[i].reply_count;
                        obj.share_count = items[i].share_count;
                        bool = await that.isexisit(obj.new_id, 'SevenMultiptDay', 'new_id');
                        //console.log(bool);
                        if (bool == 0) {
                            await that.app.mysql.insert('SevenMultiptDay', obj);
                        } else {
                            //console.log(obj.new_id, '记录已存在,结束更新');
                            continue;
                        }
                    }
                    let getJsonUrl = ` https://xueqiu.com/statuses/livenews/list.json?since_id=-1&max_id=${next_max_id}&count=${size}`;
                    options.url = getJsonUrl;
                    time--;
                    that.upSevenMultiptDaydata(options, time, next_max_id, size);
                } else {
                    console.error(err);
                }
            });
        } catch (e) {
            throw e;
        }
    }

    async SevenMultiptDay() {
        const ctx = this.ctx;
        const that = this;
        let max_id = -1;
        let getJsonUrl = ` https://xueqiu.com/statuses/livenews/list.json?since_id=-1&max_id=${max_id}&count=${size}`;
        //重新获取get
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 1, getJsonUrl);
        /*const options = await ctx.helper.getAgentIps(getIpApiURL)
            .then(async (proxy) => {
                return await ctx.helper.getWebCookie(myURL, proxy, timeout, 1, getJsonUrl);
            });*/
        //await that.app.redis.set('options', JSON.stringify(options));
        that.upSevenMultiptDaydata(options, 5, -1, 15);
        //console.log(JsonData,'out');
    }

    async getSevenMultiptDaydata(page,size) {
        const count = await this.app.mysql.query(`select count(*) from SevenMultiptDay`);
        const result = await this.app.mysql.select('SevenMultiptDay', {
            orders: [['created_at', 'desc']],
            limit: size, // 返回数据量
            offset: page, // 数据偏移量
        });
        console.log(count,'数量')
        let data = [];
        for (let i = 0; i < result.length; i++) {
            let obj = result[i];
            obj.created_at = this.ctx.helper.filteTime(parseInt(obj.created_at));
            data[i] = obj;
        }
        const obj={
            data:data,
            count:count[0]['count(*)']
        }
        return obj;
    }

    async datashow() {
        const ctx = this.ctx;
        const that = this;
        let getJsonUrl = `https://stock.xueqiu.com/v5/stock/batch/quote.json?symbol=SH000001,SZ399001,SZ399006,HKHSI,HKHSCEI,HKHSCCI,.DJI,.IXIC,.INX`;
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 1, getJsonUrl);
        /*const options = await ctx.helper.getAgentIps(getIpApiURL)
            .then(async (proxy) => {
               return await ctx.helper.getWebCookie(myURL,proxy, timeout, 1, getJsonUrl);
            });*/
        return new Promise((resolve, reject) => {
            try {
                //console.log(options)
                request(options, async function (err, res, body) {
                    if(!err && res.statusCode==200){
                        const html = myIconv.decode(body, myEcoding);
                        const JsonData = JSON.parse(html).data;
                        const items = JsonData.items;
                        let data=[]
                        for(let i = 0;i<items.length;i++){
                            let obj={};
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
                    }else {
                        console.error(err)
                    }
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    async hotstock(size,_type,type){
        const ctx = this.ctx;
        const that = this;
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
        let getJsonUrl = ` https://stock.xueqiu.com/v5/stock/hot_stock/list.json?size=${size}&_type=${_type}&type=${type}`;
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 1, getJsonUrl);
        return new Promise((resolve, reject) => {
            try {
                request(options, function (err, res, body) {
                    if (!err && res.statusCode == 200) {
                        /*const html = myIconv.decode(body, myEcoding);
                        const Jsondatas = JSON.parse(html);*/
                        // console.log(data);
                        resolve(body);
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

module.exports = NewsService;
