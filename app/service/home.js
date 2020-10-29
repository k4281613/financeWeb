'use strict';

const {Service} = require('egg')
const getIpApiURL = 'http://http.tiqu.alicdns.com/getip3?num=1&type=2&pro=&city=0&yys=0&port=1&pack=104598&ts=1&ys=1&cs=1&lb=1&sb=0&pb=4&mr=1&regions=&gm=4';//每天20个
class TestService extends Service {
    async getAgentIp() {
        const ctx = this.ctx;
        ctx.helper.getAgentIps(getIpApiURL)
        return '更新IP'
    }
}

module.exports = TestService
