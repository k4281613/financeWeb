'use strict';

const {Controller} = require('egg');

class EssenceController extends Controller {
    async NewSnowTalking() {
        const {ctx} = this;
        const data = await ctx.service.essence.NewSnowTalking();
        ctx.body = data;
    }

    async OldSonwTakling() {
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const page = body.page;
        const data = await ctx.service.essence.OldSonwTakling(page);
        ctx.body = data;
    }

    async OldSonwTaklingDetail() {
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const interviewId = body.interviewId;
        const data = await ctx.service.essence.OldSonwTaklingDetail(interviewId);
        ctx.body = data;
    }

    async counselorList() {
        const {ctx} = this;
        const data = await ctx.service.essence.counselorList();
        ctx.body = data;
    }

    async counselor() {
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const id = body.id;
        const data = await ctx.service.essence.getcounselor(id);
        ctx.body = data;
    }

    async hotmessage() {
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const {page} = body;
        const {type} = body;
        const data = await ctx.service.essence.hotmessage(page, type);
        ctx.body = data;
    }
    async hotnewDetail() {
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const {url} = body;
        const data = await ctx.service.essence.hotnewDetail(url);
        ctx.body = data;
    }
    async comment() {
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const {id} = body;
        const {page} = body;
        const {type} = body;
        const data = await ctx.service.essence.comment(id,page,type);
        ctx.body = data;
    }
    async reply_comment() {
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const {id} = body;
        const {page} = body;
        const data = await ctx.service.essence.reply_comment(id,page);
        ctx.body = data;
    }
}

module.exports = EssenceController;
