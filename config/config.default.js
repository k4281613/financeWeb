/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
const path = require('path')
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1589959108371_8503';

  // add your middleware config here
  config.middleware = ['errorHandler' ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
    },
  };
  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '123456',
      db: 0,
    }
  };
  config.security={
    csrf: {
      ignoreJSON: true,
      enable: false,
      origin: '*',  ignore: ['/upload/teacher/exper'],
    },
    domainWhiteList: [ 'http://localhost:8080','http://localhost:8081','https://getman.cn/' ],
  }
  config.cors = {
    enable: true,
    package: 'egg-cors',
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }
  config.mysql = {
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
  };
  // 日志文件
  config.logger = {
    dir: path.resolve(__dirname, '../logs/server'),
    appLogName: 'app.log',
    coreLogName: 'core.log',
    agentLogName: 'agent.log',
    errorLogName: 'error.log',
  };
  // 请求参数配置
  config.bodyParser = {
    enable: true,
    jsonLimit: '1000mb',
    formLimit: '1000mb',
    encoding: 'utf8',
    enableTypes: [ 'json', 'form', 'text' ],
    extendTypes: {
      text: [ 'text/xml', 'application/xml' ],
    },
  };
  config.multipart = {
    mode: 'file',
    whitelist: [
      '.png',
      '.jpg',
      '.doc',
      '.dwg',
      '.docx',
      '.jpeg',
      '.webp',
    ],
  };
  return {
    ...config,
    ...userConfig,
  };
};
