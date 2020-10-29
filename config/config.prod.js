module.exports = {
    redis: {
        client: {
            port: 6379,
            host: '127.0.0.1',
            password: '123456',
            db: 0,
        },
    },
    mysql: {
        // 单数据库信息配置
        client: {
            // host
            host: 'localhost',
            // 端口号
            port: '3306',
            // 用户名
            user: 'root',
            // 密码
            password: '123456',
            // 数据库名
            database: 'creeper',
        },
        // 是否加载到 app 上，默认开启
        app: true,
        // 是否加载到 agent 上，默认关闭
        agent: false,
    },
    cors : {
        enable: true,
        package: 'egg-cors',
        origin: '*',
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    },
    cluster : {
        listen: {
            port: 7003,
            hostname: '127.0.0.1', // 不建议设置 hostname 为 '0.0.0.0'，它将允许来自外部网络和来源的连接，请在知晓风险的情况下使用
            // path: '/var/run/egg.sock',
        }
    },
    security:{
        csrf: {
            ignoreJSON: true,
            enable: false,
            origin: '*',
            ignore: ['/upload/teacher/exper'],
        },
        domainWhiteList: [ 'http://localhost:8080','http://localhost:8081','https://getman.cn/' ],
    }
}
