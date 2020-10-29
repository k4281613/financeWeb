const request = require('request');
const Promise = require('bluebird');
const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1');
const os = require('os');
const superagent = require('superagent');
const getIpApiURL = 'http://http.tiqu.alicdns.com/getip3?num=1&type=2&pro=&city=0&yys=0&port=1&pack=104598&ts=1&ys=1&cs=1&lb=1&sb=0&pb=4&mr=1&regions=&gm=4';//每天20个
client.auth(123456);

module.exports = {
    //单位换算
    unitConverter(num) {
        num = parseFloat(num);
        if (Math.abs(num) > 100000000) {
            return (num / 100000000).toFixed(2) + '亿'
        } else if (Math.abs(num) > 10000) {
            return (num / 10000).toFixed(2) + '万'
        } else {
            return num.toFixed(2)
        }
    },
    //个位数补零
    addzero(time) {
        if (time < 10) {
            time = '0' + time;
        }
        return time;
    },
    //转化时间戳
    filteTime(time) {
        const ds = new Date(time);
        const date = (ds.getFullYear()) + "-" + this.addzero((ds.getMonth() + 1)) + "-" + this.addzero(ds.getDate()) + " " + this.addzero(ds.getHours()) + ":" + this.addzero(ds.getMinutes()) + ":" + this.addzero(ds.getSeconds());
        return date;
    },

    async sleep(time) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, time);
        });
    },
    userAgent() {
        const userAgents = [
            'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.0.12) Gecko/20070731 Ubuntu/dapper-security Firefox/1.5.0.12',
            'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Acoo Browser; SLCC1; .NET CLR 2.0.50727; Media Center PC 5.0; .NET CLR 3.0.04506)',
            'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.20 (KHTML, like Gecko) Chrome/19.0.1036.7 Safari/535.20',
            'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko Fedora/1.9.0.8-1.fc10 Kazehakase/0.5.6',
            'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.71 Safari/537.1 LBBROWSER',
            'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 2.0.50727; Media Center PC 6.0) ,Lynx/2.8.5rel.1 libwww-FM/2.14 SSL-MM/1.4.1 GNUTLS/1.2.9',
            'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)',
            'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; QQBrowser/7.0.3698.400)',
            'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 732; .NET4.0C; .NET4.0E)',
            'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:2.0b13pre) Gecko/20110307 Firefox/4.0b13pre',
            'Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; fr) Presto/2.9.168 Version/11.52',
            'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.0.12) Gecko/20070731 Ubuntu/dapper-security Firefox/1.5.0.12',
            'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; LBBROWSER)',
            'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko Fedora/1.9.0.8-1.fc10 Kazehakase/0.5.6',
            'Mozilla/5.0 (X11; U; Linux; en-US) AppleWebKit/527+ (KHTML, like Gecko, Safari/419.3) Arora/0.6',
            'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; QQBrowser/7.0.3698.400)',
            'Opera/9.25 (Windows NT 5.1; U; en), Lynx/2.8.5rel.1 libwww-FM/2.14 SSL-MM/1.4.1 GNUTLS/1.2.9',
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
        ];
        const userAgent = userAgents[parseInt(Math.random() * userAgents.length)];
        return userAgent;
    },
    async getRides(key) {
        return new Promise((resolve, reject) => {
            try {
                client.get(key, function (err, reply) {
                    if (err) throw err;
                    // console.log(reply);
                    resolve(reply);
                });
            } catch (e) {
                reject(e);
            }
        });
    },
    async setRides(key, value) {
        return new Promise((resolve, reject) => {
            try {
                client.set(key, value, function (err, reply) {
                    if (err) throw err;
                    //console.log(reply, 'redis数据存储成功');
                    resolve(reply);
                });
            } catch (e) {
                reject(e);
            }
        });
    },
    getlocalIp() {
        let localhost = '';
        try {
            let network = os.networkInterfaces();
            localhost = network[Object.keys(network)[0]][1].address;
            console.log(localhost,99);
            return localhost;
        } catch (e) {
            localhost = 'localhost';
        }
    },
    async addwhitemeun(ip) {
        return new Promise((resolve, reject) => {
            const url = `wapi.http.cnapi.cc/index/index/save_white?neek=131205&appkey=c18da4931ca31cdba7350d0f148c39e9&white=${ip}`;
            console.log(url);
            superagent.get(url).then(res => {
                const body = res.body;
                console.log(body);
                resolve(1);
            }).catch(e => {
                throw(e);
            });
        })
    },
    async test(apiURL,options) {
        const that = this;
        return new Promise((resolve, reject) => {
            try {
                request(options, async function (err, res, body) {
                    if (err) throw err;
                    if (JSON.parse(body).code == 117 || JSON.parse(body).code==113) {
                        console.log(body)
                        const str = JSON.parse(body).msg;
                        const ip = str.substring(str.indexOf('单') + 1, str.length);
                        // console.log(ip);
                        that.addwhitemeun(ip);
                        await that.sleep(2500).then(function () {
                            that.getAgentIps(apiURL);
                        });
                    } else {
                        //console.log('获取ip成功,存储入redis', JSON.parse(body));
                        that.setRides('ipJsons', JSON.stringify(JSON.parse(body).data[0]));
                        console.log(body)
                        const ret = JSON.parse(body).data[0].ip + ':' + JSON.parse(body).data[0].port;
                        resolve(ret);
                    }
                });
            } catch (e) {
                reject(e)
            }
        })
    },
    async getAgentIps(apiURL) {
        const that = this;
        //console.log('开始获取ip');
        return new Promise(async (resolve, reject) => {
            /*const options = {
                method: 'GET',
                url: apiURL,
            };
            try {
                const reply = await that.getRides('ipJsons');
                console.log(reply);
                const expire_time = (new Date(Date.parse(JSON.parse(reply).expire_time.replace(/-/g, '/')))).getTime();
                if (reply == null || expire_time < Date.now()) {
                    console.log('当前ip已过期，utf8');
                    const data = await that.test(apiURL,options);
                    resolve(data);
                } else {
                    console.log('当前ip仍然有效');
                    const ret = JSON.parse(reply).ip + ':' + JSON.parse(reply).port;
                    // resolve(ret);
                }
            } catch (e) {
                return reject(e);
            }*/
            resolve(that.getlocalIp());

        });
    },
    async getNewIps(apiURL) {
        const that = this;
        //console.log('开始获取ip');
        return new Promise(async (resolve, reject) => {
            resolve(that.getlocalIp());
            /*const options = {
                method: 'GET',
                url: apiURL,
            };
            try {
                request(options, async function (err, res, body) {
                    if (err) throw err;
                    if (JSON.parse(body).code == 117) {
                        console.log(JSON.parse(body), 197);
                        const str = JSON.parse(body).msg;
                        const ip = str.substring(str.indexOf('单') + 1, str.length - 1);
                        //console.log(ip);
                        console.log(ip)
                        that.addwhitemeun(ip);
                        await that.sleep(2500).then(function () {
                            that.getNewIps(apiURL);
                        });
                    } else {
                        console.log('获取ip成功,存储入redis', JSON.parse(body));
                        that.setRides('ipJsons', JSON.stringify(JSON.parse(body).data[0]));
                    }
                });
            } catch (e) {
                return reject(e);
            }*/
        });
    },
    async getWebCookie(myURL, proxy, timeout, mybool, mockreqURL) {
        const userAgent = this.userAgent();
        const that = this;
        return new Promise(async (resolve, reject) => {
            const j = request.jar();
            const options = {
                url: myURL, // 设置目标网页的url
                encoding: null, // 设置编码方式，null即不进行编码，将编码工作交给iconv模块，详见2.2
                headers: {
                    'User-Agent': userAgent,
                }, // 设置header，用于防止爬虫被屏蔽，对于大多数网页可以缺省
                // proxy: 'http://' + proxy,
                timeout: timeout, // 设置等待时间，单位为ms，超过等待时间err返回值为错误
                jar: j, // cookie
            };
            const reply = await that.getRides('options');//测试暂时关闭
            const expire_time = Date.parse(new Date(JSON.parse(reply).jar._jar.cookies[0].lastAccessed))+8*60*60*1000;
            // console.log(expire_time,Date.now())
            if (expire_time < Date.now()) {
                console.log('cookie已过期');
                that.getNewIps(getIpApiURL);
                request(options, function (err, res, body) {
                    try {
                        // console.log('当前ip:' + proxy + '尝试重新获取cookie.......');
                        if (!err && res.statusCode === 200) {
                            console.log('');
                            const cookie_string = j.getCookieString(myURL);
                            that.setRides('CookieJsons', cookie_string);
                            that.setRides('options', JSON.stringify(options));
                            // const cookies = j.getCookies(myURL);
                            options.headers.cookie = cookie_string;
                            if (mybool === 1) {
                                options.url = mockreqURL;
                            }
                            resolve(options);
                        }
                    } catch (e) {
                        return reject(e);
                    }
                });
            } else {
                options.headers.cookie = await that.getRides('CookieJsons');
                if (mybool === 1) {
                    options.url = mockreqURL;
                }
                resolve(options);
            }
        });
    },
};
