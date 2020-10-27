const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/controller/home.test.js', () => {
    it('should redirect',()=>{
        return app.httpRequest().get('/').expect(302)
    })
});
