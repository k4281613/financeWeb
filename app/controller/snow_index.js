'use strict';

const Controller = require('egg/index').Controller;
const path = require('path');
const fs = require('fs');

class NewsController extends Controller {
    async videofile() {
        const ctx = this.ctx;
        // const data = await ctx.service.snowIndex.videofile();
        const file = path.resolve(__dirname, "../public/video/yi.mkv");
        // ctx.attachment(file);
        // ctx.set('Content-Type', 'application/octet-stream')
        // console.log(11);
        ctx.body=file;

    }

    async SnowHotNew() {
        const ctx = this.ctx;
        const {body} = ctx.request;
        const {page, size} = body;
        const list = await ctx.service.snowIndex.gethotAlldata(page, size);
        console.log(list.length);
        const dataList = {
            list: list
        };
        ctx.body = dataList;
        // await this.ctx.service.snowIndex.SnowHotNew();
        //await ctx.render('index/SnowHotNew.tpl', dataList);
        // console.log(dataList);
    }

    async SevenMultiptDay() {
        const ctx = this.ctx;
        const {body} = ctx.request;
        const {page, size} = body;
        const list = await ctx.service.snowIndex.getSevenMultiptDaydata(page, size);
        const dataList = {
            list: list
        };
        ctx.body = dataList;
        // await this.ctx.service.snowIndex.SevenMultiptDay();
        //await ctx.render('index/SevenMultiptDay.tpl', dataList);
    }

    async datashow() {
        const ctx = this.ctx;
        const list = await ctx.service.snowIndex.datashow();
        //console.log(list)
        ctx.body = list;
    }

    async hotstock() {
        const {ctx} = this;
        const {body} = ctx.request;
        const size = body.size;
        const _type = body._type;
        const type = body.type;
        const list = await ctx.service.snowIndex.hotstock(size, _type, type);
        ctx.body = list;
    }
}

module
    .exports = NewsController;
