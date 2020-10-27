'use strict';

/** @type Egg.EggPlugin */
module.exports = {
    redis: {
        enable: true,
        package: 'egg-redis',
    },
    validate: {
        enable: false,
        package: 'egg-validate',
    },
    cors: {
        enable: true,
        package: 'egg-cors',
    },
    jwt: {
        enable: true,
        package: 'egg-jwt',
    },
    mysql: {
        enable: true,
        package: 'egg-mysql',
    },
    nunjucks: {
        enable: true,
        package: 'egg-view-nunjucks',
    }
};
