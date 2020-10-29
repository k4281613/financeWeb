module.exports = {
    redis: {
        client: {
            port: 6379,
            host: '127.0.0.1',
            password: '123456',
            db: 0,
        },
    },
    cluster: {
        listen: {
            port: 3000,
            hostname: '127.0.0.1', // 不建议设置 hostname 为 '0.0.0.0'，它将允许来自外部网络和来源的连接，请在知晓风险的情况下使用
            // path: '/var/run/egg.sock',
        }
    },
    security: {
        csrf: {
            enable: false,
            ignoreJSON: false,
        },
        domainWhiteList: ['*'], // 跨域访问白名单
    }
}
