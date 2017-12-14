var should = require("should");
var request = require('supertest');


describe('miss username or password', function () {
    var agent1 = request.agent();
    it('username is null. Expecting fail', function (done) {

        /*request("http://localhost:9971").post('/api/meituan/getOrderDetail')
           .set('Accept', 'application/json')
            .set('Content-Type', 'text/plain')
            .send(JSON.stringify({
                "username": "",
                "passwd": "py123456",
                "isForce": false,
                "orderNo": 474180703,
                "userId": 845807627
            }))
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) done(err);
                res.body.should.have.property('ret', false);
                res.body.should.have.property('msg', "请输入用户名和密码");
                done();
            });*/

        /*agent1.post('http://localhost:9971/api/meituan/getOrderDetail')
           set('Accept', 'application/json')
            .set('Content-Type', 'text/plain')
            .send(JSON.stringify({
                "username": "",
                "passwd": "py123456",
                "isForce": false,
                "orderNo": 474180703,
                "userId": 845807627
            }))
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) done(err);
                res.body.should.have.property('ret', false);
                res.body.should.have.property('msg', "请输入用户名和密码");
                done();
            });*/
        done();
    });


});
