'use strict';

const {Service} = require('egg')
const request = require('request');
const Promise = require('bluebird');
const myIconv = require('iconv-lite/lib/index');
const myCheerio = require('cheerio');
const myEcoding = 'UTF-8';
const myURL = 'https://xueqiu.com/talks/all';
const timeout = 8000;
const webURL = 'https://xueqiu.com';

class EssenceService extends Service {
    async reply_comment(id,page) {
        const ctx = this.ctx;
        const that = this;
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
        let JsonUrl = `https://xueqiu.com/comments/replies.json?id=${id}&page=${page}&count=20&type=0`;
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 1, JsonUrl);
        return new Promise((resolve, reject) => {
            try {
                request(options, function (err, res, body) {
                    const html = myIconv.decode(body, myEcoding);
                    const Jsondatas = JSON.parse(html);
                    const replies = Jsondatas.replies;
                    for (let i = 0; i < replies.length; i++) {
                        let str = replies[i].user.profile_image_url;
                        let obj = {
                            text: replies[i].text,
                            timeBefore: replies[i].timeBefore,
                            screen_name: replies[i].user.screen_name,
                            like_count: replies[i].like_count,
                            profile_image_url: 'https://xavatar.imedao.com/' + str.substring(0, str.indexOf(',')) + '!50x50.png',
                            profile: 'https://xueqiu.com/u' + replies[i].user.profile,
                        }
                        if (replies[i].reply_comment != null) {
                            obj.reply_screenName = replies[i].reply_screenName;
                            obj.reply_timeBefore = replies[i].reply_comment.timeBefore;
                            obj.reply_comment_text = replies[i].reply_comment.text;
                            obj.reply_comment_profile = 'https://xueqiu.com/u' + replies[i].reply_comment.user.profile;
                        }
                        Jsondatas.replies[i] = obj;
                    }
                    resolve(Jsondatas);
                })
            } catch (e) {
                reject(e)
            }
        })

    }

    async comment(id, page, type) {
        const ctx = this.ctx;
        const that = this;
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
        let JsonUrl = ``;
        if (type == 'wonderful') {
            JsonUrl = `https://xueqiu.com/statuses/comments_excellent.json?id=${id}&count=20&page=${page || 1}&reply=true&asc=false`;
        } else {
            JsonUrl = `https://xueqiu.com/statuses/comments.json?id=${id}&count=20&page=${page || 1}&reply=true&asc=false&type=status&split=true`;
        }
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 1, JsonUrl);
        return new Promise((resolve, reject) => {
            try {
                request(options, function (err, res, body) {
                    const html = myIconv.decode(body, myEcoding);
                    const Jsondatas = JSON.parse(html);
                    const comments = Jsondatas.comments;
                    for (let i = 0; i < comments.length; i++) {
                        let str = comments[i].user.profile_image_url;
                        let obj = {
                            id: comments[i].id,
                            text: comments[i].text,
                            timeBefore: comments[i].timeBefore,
                            reply_count: comments[i].reply_count,
                            screen_name: comments[i].user.screen_name,
                            like_count: comments[i].like_count,
                            profile_image_url: 'https://xavatar.imedao.com/' + str.substring(0, str.indexOf(',')) + '!50x50.png',
                            profile: 'https://xueqiu.com/u' + comments[i].user.profile,
                        }
                        if (type == 'all' && comments[i].reply_comment != null) {
                            obj.reply_screenName = comments[i].reply_screenName;
                            obj.reply_comment_text = comments[i].reply_comment.text;
                            obj.reply_comment_profile = 'https://xueqiu.com/u' + comments[i].reply_comment.user.profile;
                        }
                        Jsondatas.comments[i] = obj;
                    }
                    if (type == 'wonderful') {
                        Jsondatas.count = comments.length;
                        Jsondatas.maxPage = 1;
                    }
                    resolve(Jsondatas);
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    async hotnewDetail(url) {
        const ctx = this.ctx;
        const that = this;
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
        const options = await ctx.helper.getWebCookie(url, proxy, timeout, 0, '');
        return new Promise((resolve, reject) => {
            try {
                request(options, function (err, res, body) {
                    const html = myIconv.decode(body, myEcoding);
                    const $ = myCheerio.load(html, {decodeEntities: false})
                    const text = $('div.article__bd__detail').html();
                    resolve(text);
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    async hotmessage(page, type) {
        const ctx = this.ctx;
        const that = this;
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
        const Jsonurl = `https://xueqiu.com/statuses/hots.json?a=1&count=10&page=${page}&meigu=0&scope=day&type=${type}`;
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 1, Jsonurl);
        return new Promise((resolve, reject) => {
            try {
                request(options, function (err, res, body) {
                    if (!err && res.statusCode == 200) {
                        const html = myIconv.decode(body, myEcoding);
                        const Jsondatas = JSON.parse(html);
                        for (let i = 0; i < Jsondatas.length; i++) {
                            const str = Jsondatas[i].user.profile_image_url;
                            const index = str.lastIndexOf(',');
                            let obj = {
                                id: Jsondatas[i].id,
                                like_count: Jsondatas[i].like_count,
                                retweet_count: Jsondatas[i].retweet_count,
                                reply_count: Jsondatas[i].reply_count,
                                created_at: ctx.helper.filteTime(Jsondatas[i].created_at),
                                description: Jsondatas[i].description,
                                symbol_id: Jsondatas[i].symbol_id,
                                target: webURL + Jsondatas[i].target,
                                title: Jsondatas[i].title,
                                user: Jsondatas[i].user.screen_name,
                                profile_image_url: 'https://xavatar.imedao.com/' + str.substring(index + 1, str.length).replace(/100/g, '50'),
                                profile: webURL + Jsondatas[i].user.profile,
                                source: Jsondatas[i].source
                            }
                            Jsondatas[i] = obj;
                        }
                        resolve(Jsondatas);
                    } else {
                        reject(err)
                    }
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    async getcounselor(id) {
        const ctx = this.ctx;
        const result = ctx.app.mysql.select('counselor', {
            where: {category_id: id},
            order: [['user_id', 'desc']]
        });
        return result;
    }

    async counselor(id) {
        const categoryList = `https://xueqiu.com/recommend/user/industry.json?id=${id}&_=${Date.now()}`
        const ctx = this.ctx;
        const that = this;
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 1, categoryList);
        return new Promise((resolve, reject) => {
            try {
                request(options, async function (err, res, body) {
                    if (!err && res.statusCode == 200) {
                        const html = myIconv.decode(body, myEcoding);
                        const Jsondatas = JSON.parse(html);
                        const category = Jsondatas.industries[0].industry.name;
                        const users = Jsondatas.industries[0].users;
                        for (let i = 0; i < users.length; i++) {
                            //xavatar.imedao.com/community/20177/1503236318187-1503236361032.png!100x100.png
                            let str = 'https://xavatar.imedao.com/' + users[i].profile_image_url;
                            let obj = {
                                user_id: users[i].id,
                                screen_name: users[i].screen_name,
                                profile_image_url: str.substring(0, str.indexOf(',')) + '!50x50.png',
                                description: users[i].description,
                                verified_description: users[i].verified_description,
                                profile: webURL + users[i].profile,
                                category: category,
                                category_id: id
                            }
                            await that.app.mysql.query(`select count(*) as mybool from counselor where user_id = ? and category_id = ?`, [obj.user_id, id]).then(async function (result) {
                                const mybool = result[0].mybool;
                                if (!mybool) {
                                    const result = await that.app.mysql.insert('counselor', obj);
                                    console.log('插入状态：' + result.affectedRows, category, obj.screen_name);
                                }
                            });
                        }
                        //console.log(users)
                        resolve(users);
                    } else {
                        reject(err)
                    }
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    async updateCounselor() {
        const list = await this.counselorList();
        for (let i = 0; i < list.length; i++) {
            const id = list[i].id;
            this.counselor(id)
        }
        return '更新咨询师'
    }

    async counselorList() {
        const ctx = this.ctx;
        const that = this;
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
        const Jsonurl = `https://xueqiu.com/recommend/user/industry.json?detail=1&index=1&_=${Date.now()}`;
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 1, Jsonurl);
        return new Promise((resolve, reject) => {
            try {
                request(options, function (err, res, body) {
                    if (!err && res.statusCode == 200) {
                        const html = myIconv.decode(body, myEcoding);
                        const Jsondatas = JSON.parse(html);
                        const list = Jsondatas.list;
                        resolve(list);
                    } else {
                        reject(err)
                    }
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    async NewSnowTalking() {
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
                        const $ = myCheerio.load(html, {decodeEntities: false});//decodeEntitiers取消实体编码
                        const context = $('ul.latest_interview').children('li');
                        let data = [];
                        context.each(function (i, e) {
                            // console.log(i,$(e).html())
                            let obj = {};
                            obj.imgsrc = 'https:' + $(e).children('img.img').attr('src');
                            obj.topic = $(e).children('div').children('h4').text();
                            obj.url = webURL + $(e).children('div').children('h4').children('a').attr('href');
                            obj.guest = $(e).children('div').children('p.guests').children('a').text();
                            obj.guesturl = webURL + $(e).children('div').children('p.guests').children('a').attr('href');
                            obj.time = $(e).children('div').children('p').eq(1).text();
                            obj.description = $(e).children('div').children('p.bd').text();
                            data[i] = obj;
                        })
                        // console.log(data);
                        resolve(data);
                    } else {
                        reject(err)
                    }
                })
            } catch (e) {
                reject(e)
            }
        })

    }

    async postdetail(options, id, isJson) {
        // request(options,function (err,res,body) {
        //     const html=myIconv(body,myEcoding);
        //     const $=myCheerio.load(html,{decodeEntities:false})
        // })
        return new Promise((resolve, reject) => {
            try {
                request(options, function (err, res, body) {
                    if (!err && res.statusCode == 200) {
                        const html = myIconv.decode(body, myEcoding);
                        let Jsondatas;
                        if (isJson) {
                            Jsondatas = JSON.parse(html);
                            Jsondatas.from = 'https://xueqiu.com/talks/item/' + id;
                            const statuses = Jsondatas.statuses;
                            Jsondatas.user = statuses[0].user.screen_name;
                            for (let i = 0; i < statuses.length; i++) {
                                let obj = {};
                                obj.text = statuses[i].text;
                                obj.timeBefore = statuses[i].timeBefore;
                                obj.answer = statuses[i].user.screen_name;
                                if (statuses[i].retweeted_status != null) {
                                    obj.question = statuses[i].retweeted_status.description;
                                    obj.quester = statuses[i].retweeted_status.user.screen_name;
                                    obj.quest_timeBefore = statuses[i].retweeted_status.timeBefore;
                                } else {
                                    obj.question = '无提问者，嘉宾发表';
                                }
                                Jsondatas.statuses[i] = obj;
                            }
                        } else {
                            const $ = myCheerio.load(html, {decodeEntities: false});
                            let obj = {}
                            obj.description = $('p.detail').text().replace('收起', '');
                            obj.imgsrc = 'https:' + $('div.topic').children('img').attr('src');
                            obj.interview_time = $('div.interview_time').text();
                            // console.log(obj.interview_time)
                            Jsondatas = obj;
                        }
                        //console.log(detail)
                        resolve(Jsondatas);
                    } else {
                        reject(err);
                    }
                });
            } catch (e) {
                throw e;
            }
        });
    }

    async OldSonwTaklingDetail(interviewId) {
        const ctx = this.ctx;
        const that = this;
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
        const Jsonurl = `https://xueqiu.com/interview/answer/list.json?interviewId=${interviewId}&access_token=ad923af9f68bb6a13ada0962232589cea11925c4&_=${Date.now()}`;
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 1, Jsonurl);
        let obj = {}
        options.url = 'https://xueqiu.com/talks/item/' + interviewId;
        obj.topic = await that.postdetail(options, interviewId, false);
        options.url = Jsonurl;
        obj.detail = await that.postdetail(options, interviewId, true);
        return obj;
    }

    async OldSonwTakling(page) {
        const ctx = this.ctx;
        const that = this;
        const reply = await that.app.redis.get('ipJsons');
        const proxy = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
        let getJsonUrl = ` https://xueqiu.com/interview/list/backword.json?page=${page}&_=${Date.now()}`;
        const options = await ctx.helper.getWebCookie(myURL, proxy, timeout, 1, getJsonUrl);
        return new Promise((resolve, reject) => {
            try {
                request(options, async function (err, res, body) {
                    if (!err && res.statusCode == 200) {
                        const html = myIconv.decode(body, myEcoding);
                        const Jsondatas = JSON.parse(html);
                        const interviews = Jsondatas.interviews;
                        for (let i = 0; i < interviews.length; i++) {
                            let obj = interviews[i];
                            obj.interviewId = obj.url.replace('https://xueqiu.com/talks/item/', '');
                            Jsondatas.interviews[i] = obj;
                        }
                        resolve(Jsondatas);
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

module.exports = EssenceService;
