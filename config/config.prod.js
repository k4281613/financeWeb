module.exports = {
  redis : {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '123456',
      db: 0,
    },
  },
  cluster : {
    listen: {
      path: '',
      port: 3000,
      hostname: 'localhost', // localhost
    },
  },
  security : {
    csrf: {
      enable: true,
      ignoreJSON: false,
    },
    domainWhiteList: [ '*' ], // 跨域访问白名单
  }
}
