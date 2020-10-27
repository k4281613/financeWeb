const {Service} = require('egg')
// const puppeteer = require('puppeteer');
const request = require('request');
const fs = require("fs");
const path = require("path");
const pixels = require("get-image-pixels");
const resemble = require("node-resemble-js");

class TestService extends Service {
    /*// async codecheck(tel,code) {
    //     const bgImg = path.resolve(__dirname, "bg.png");
    //     const fullbgImg = path.resolve(__dirname, "fullbg.png");
    //
    //     async function run() {
    //         const browser = await puppeteer.launch({
    //             headless: true//不显示浏览器
    //         });
    //         const page = await browser.newPage();
    //         await page.setViewport({
    //             width: 1920,
    //             height: 1080,
    //             deviceScaleFactor: 1,
    //         });
    //         await page.goto('https://xueqiu.com/');
    //         await page.click('.Header_nav__login__btn_1YU');//打开登录按钮
    //         await page.waitFor(300);//等待安全控件检查完毕
    //         await page.waitForSelector('.Loginmodal_modal__login__control_33o');
    //         const telinput = await page.$(`.Loginmodal_form-group_17J input[name='username']`);
    //         await telinput.type(tel);
    //         const pswinput = await page.$(`.Loginmodal_form-group_17J input[name='password']`);
    //         await pswinput.type(code);
    //
    //         // 获取滑动距离
    //         async function getDistance() {
    //
    //             // 获取canvas
    //             let {bg, fullbg} = await page.evaluate(() => {
    //                 const fullbg = document.querySelector(".geetest_canvas_fullbg");
    //                 const bg = document.querySelector(".geetest_canvas_bg");
    //                 return {
    //                     bg: bg.toDataURL(),
    //                     fullbg: fullbg.toDataURL()
    //                 };
    //             });
    //
    //             bg = bg.replace(/^data:image\/\w+;base64,/, "");
    //             fullbg = fullbg.replace(/^data:image\/\w+;base64,/, "");
    //             let bgDataBuffer = new Buffer(bg, "base64");
    //             let fullbgDataBuffer = new Buffer(fullbg, "base64");
    //
    //             fs.writeFileSync(bgImg, bgDataBuffer);
    //             fs.writeFileSync(fullbgImg, fullbgDataBuffer);
    //
    //             // 通过resemble比较背景图和缺口图的不同
    //             resemble(bgImg)
    //                 .compareTo(fullbgImg)
    //                 .ignoreColors()
    //                 .onComplete(async function (data) {
    //                     fs.writeFileSync(path.resolve(__dirname, `diff.png`), data.getBuffer());
    //                 });
    //
    //             let {data} = await pixels(path.resolve(__dirname, `diff.png`), {
    //                 cache: false
    //             });
    //
    //             // 获取缺口距离左边的做小位置，即计为需要滑动的距离
    //             let arr = [];
    //             for (let i = 10; i < 150; i++) {
    //                 for (let j = 80; j < 220; j++) {
    //                     let p = 260 * i + j;
    //                     p = p << 2;
    //                     if (data[p] === 255 && data[p + 1] === 0 && data[p + 2] === 255) {
    //                         arr.push(j);
    //                         break;
    //                     }
    //                 }
    //             }
    //             return Math.min(...arr);
    //         }
    //
    //         const distance = await getDistance();
    //
    //         const button = await page.$(".geetest_slider_button");
    //         const box = await button.boundingBox();
    //         const axleX = Math.floor(box.x + box.width / 2);
    //         const axleY = Math.floor(box.y + box.height / 2);
    //
    //         await btnSlider(distance);
    //
    //         // 滑动滑块
    //         async function btnSlider(distance) {
    //             await page.mouse.move(axleX, axleY);
    //             await page.mouse.down();
    //             await page.waitFor(200);
    //             await page.mouse.move(box.x + distance / 4, axleY, {steps: 20});
    //             await page.waitFor(200);
    //             await page.mouse.move(box.x + distance / 3, axleY, {steps: 18});
    //             await page.waitFor(350);
    //             await page.mouse.move(box.x + distance / 2, axleY, {steps: 15});
    //             await page.waitFor(400);
    //             await page.mouse.move(box.x + (distance / 3) * 2, axleY, {steps: 15});
    //             await page.waitFor(350);
    //             await page.mouse.move(box.x + (distance / 4) * 3, axleY, {steps: 10});
    //             await page.waitFor(350);
    //             await page.mouse.move(box.x + distance + 30, axleY, {steps: 10});
    //             await page.waitFor(300);
    //             await page.mouse.up();
    //             await page.waitFor(1000);
    //
    //             const text = await page.evaluate(() => {
    //                 return document.querySelector(".geetest_result_box").innerText;
    //             });
    //             console.log(text);
    //             let step = 0;
    //             if (text) {
    //                 // 如果失败重新获取滑块
    //                 if (
    //                     text.includes("怪物吃了拼图") ||
    //                     text.includes("拖动滑块将悬浮图像正确拼合")
    //                 ) {
    //                     await page.waitFor(2000);
    //                     await page.click(".geetest_refresh_1");
    //                     await page.waitFor(1000);
    //                     step = await getDistance();
    //                     await btnSlider(step);
    //                 } else if (text.includes("速度超过")) {
    //                     console.log("success");
    //                 }
    //             }
    //         }
    //     }
    //
    //     run();
    //     await page.click('.Loginmodal_btn-active_2oj');//点击登录
    //     await page.waitFor(300);//等待安全控件检查完毕
    //     await page.screenshot({path: 'xueqiu.png'});
    //     await browser.close();
    // }*/

    async login(tel, code) {
        const {ctx} = this;
        const myurl = 'https://xueqiu.com/snb/provider/login';
        const cookie = await ctx.helper.getRides('CookieJsons');
        const options = {
            url: myurl,
            host: 'xueqiu.com',
            port: 443,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': cookie
            },
            form: {
                areacode: '86',
                telephone: tel,
                code:code,
                remember_me:true
            }
        }
        return new Promise((resolve, reject) => {
            request(options, (err, res, body) => {
                resolve(body);
            })
        })
    }


    async sendcode(tel) {
        const {ctx} = this;
        const myurl = 'https://xueqiu.com/account/sms/send_verification_code.json';
        const cookie = await ctx.helper.getRides('CookieJsons');
        const options = {
            url: myurl,
            host: 'xueqiu.com',
            port: 443,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': cookie
            },
            form: {
                areacode: '86',
                telephone: tel
            }
        }
        return new Promise((resolve, reject) => {
            request(options, (err, res, body) => {
                resolve(body);
            })
        })
    }
}

module.exports = TestService
