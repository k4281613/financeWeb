const {app, mock, assert} = require('egg-mock/bootstrap');

describe('test/controller/snow_index.test.js', () => {
    it('controller.snowIndex.SnowHotNew,/getsonwhotnew', () => {
        // 对 app 发起 `GET /` 请求
        return app.httpRequest()
            .post('/getsonwhotnew')
            .send({page: 1, size: 1})
            .expect(200) // 期望返回 status 200
            .then(response => {
                console.log(response.text)
                // assert(response.body.email, 'foo@bar.com')
            })
    });
});
