const Subscription = require('egg').Subscription;

class UpdateCache extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            cron: '0 */10 * * * ?',
            // cron: '0 0 5 * * ?',
            type: 'all', // 指定所有的 worker 都需要执行
            // immediate: true,//项目启动就执行一次定时任务
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        const text = await this.ctx.service.home.getAgentIp();
        console.log(text);
    }
}

module.exports = UpdateCache;
