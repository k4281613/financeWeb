'use strict';

const Controller = require('egg').Controller;
const fs = require("fs")
const path = require("path");

class HomeController extends Controller {
    async index() {
        const {ctx} = this;
        const datalist = {
            list: [
                {
                    id: 1, title: '首页', children: [
                        {title: '今日热帖', url: '/sonwhotnew'},
                        {title: '7*24', url: '/SevenMultiptDay'},
                    ]
                },
            ]
        };
        await ctx.render('home.tpl', datalist);
    }

}

module.exports = HomeController;
