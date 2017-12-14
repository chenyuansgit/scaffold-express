const request = require('supertest');
const expect = require('chai').expect;
const qs = require('querystring');


const server = require('../../src/server.js');

const agent1 = request.agent(server);


describe('test user api', () => {
    before(() => {
        console.log("在所有测试用例执行之前完成");
    });

    // 用户登录
    describe('when user not login in and get hotel info', () => {
        it('POST /public + getHotelInfo', (done) => {
            /*agent1.post('/public')
                .send(qs.stringify({
                    operationName: '',
                    variables: '',
                    query: `{
          getHotelInfo(hotelid:1) {
            id
            name
          }
       }`
                }))
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    // console.log("res.body:", res.body);
                    console.log('cookie:', res.headers['set-cookie']);
                    expect(err).to.be.a('null');
                    expect(res.headers['set-cookie']).not.to.be.a('null');
                    expect(res.body).to.include.keys('data');
                    expect(res.body.data).to.include.keys('getHotelInfo');
                    expect(res.body.data.getHotelInfo.id).to.be.equal('1');
                    done();
                });*/
            done();
        });
    });

    // 在上述所用用例执行后执行
    after(() => {
        console.log("在所有测试用例执行之后完成");
    });
});

