'use strict';

const {Controller} = require('egg');

class MarketController extends Controller {
    async getlist() {
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const {region} = body;
        const data = await ctx.service.market.getlist(region);
        ctx.body = data;
    }

    async screenerValues() {
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const {filed} = body;
        const {adj} = body;
        const {date} = body;
        const data = await ctx.service.market.screenerValues(filed, adj, date);
        ctx.body = data;
    }

    async searchValues() {
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const {region} = body;
        const {exchange} = body;
        const {areacode} = body;
        const {indcode} = body;
        const {page} = body;
        const {condition} = body;
        const {order} = body;
        const {order_by} = body;
        const {sizer} = body;
        const data = await ctx.service.market.searchValues(sizer, region, exchange, areacode, indcode, page, condition, order, order_by);
        ctx.body = data;
    }

    async IndustriesList() {
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const {region} = body;
        const data = await ctx.service.market.IndustriesList(region);
        ctx.body = data;
    }

    async marketCenter() {
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const {region} = body
        const data = await ctx.service.market.marketCenter(region);
        ctx.body = data;
    }

    async newStockforeshow(){
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const {region} = body
        const data = await ctx.service.market.newStockforeshow(region);
        ctx.body = data;
    }

    async marketsort(){
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const {region} = body;
        const data = await ctx.service.market.marketsort(region);
        ctx.body = data;
    }
    async shmarket(){
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const {category,page,addition} = body;
        const data = await ctx.service.market.shmarket(category,page,addition);
        ctx.body = data;
    }
    async hkmarket(){
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const {category,page,addition} = body;
        const data = await ctx.service.market.hkmarket(category,page,addition);
        ctx.body = data;
    }
    async usmarket(){
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const {category,page,addition} = body;
        const data = await ctx.service.market.usmarket(category,page,addition);
        ctx.body = data;
    }
    async debtmarket(){
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const {category,page} = body;
        const data = await ctx.service.market.debtmarket(category,page);
        ctx.body = data;
    }
    async fundmarket(){
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const {category,page} = body;
        const data = await ctx.service.market.fundmarket(category,page);
        ctx.body = data;
    }
    async grouphotoday(){
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const {page} = body;
        const data = await ctx.service.market.grouphotoday(page);
        ctx.body = data;
    }
    async groupdetail(){
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const {cube_symbol,cube_id,market,rb_id} = body;
        const data = await ctx.service.market.groupdetail(cube_symbol,cube_id,market,rb_id);
        ctx.body = data;
    }
}

module.exports = MarketController;
