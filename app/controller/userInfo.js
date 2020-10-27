const {Controller} = require('egg');

class LoginController extends Controller {
    async login() {
        const {ctx,app} = this;
        const {body} = ctx.request;
        const {tel,code} = body;
        console.log(body)
        const token=app.jwt.sign({
            'tel':tel
        },app.config.jwt.secret)
   /*     const decode = app.jwt.verify(token,app.config.jwt.secret)
        console.log(decode)*/
        const data = await ctx.service.userInfo.login(tel,code);
        ctx.set({'authorization':token})
        ctx.body = data;
    }

    async sendcode() {
        const {ctx} = this;
        const {body} = ctx.request;
        console.log(body);
        const {tel} = body;
        const data = await ctx.service.userInfo.sendcode(tel);
        ctx.body = data;
    }
}

module.exports = LoginController;
