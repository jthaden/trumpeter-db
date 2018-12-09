process.env.NODE_ENV = 'test';

var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

// TODO: This or mongoose.model('Model')?
var User        = require('./models/user');
var UserInfo    = require('./models/user-info');
var Trumpet     = require('./models/trumpet');
var Retrumpet   = require('./models/retrumpet');


// TODO: replace arrow functions (lambdas)
// assert or expect instead of should?

chai.use(chatHttp);


/**************
** Trumpets
**************/

// delete all Trumpets before testing
describe('Trumpets', () => {
    beforeEach((done) => {
        Trumpet.remove({}, (err) => {
            done();
        });
    });
    // GET: no trumpets in db
    describe('/GET trumpets', () => {
        it('should get ALL trumpets (none)', (done) => {
            chai.request(server)
                .get('/trumpets')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    // POST: missing required field (user_info_id)
    describe('/POST trumpets', () => {
        it('should not POST a trumpet without user_info_id field', (done) => {
            let trumpet = {
                text: "wololo DON'T POST ME!"
            }
            chai.request(server)
                .post('/trumpets')
                .send(trumpet)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('user_info_id');
                    res.body.errors.user_info_id.should.have.property.('kind').eql('required');
                    done();
                });
        });
        // POST: valid trumpet with default values
        // also test lack of reply_trumpet_ID  TODO syntax works?
        it('should POST a trumpet with default values', (done) => {
            var info_id_1 = mongoose.Types.ObjectId();
            let trumpet = {
                user_info_id: info_id_1,
                text: "PLS POST!"
            }
            chai.request(server)
                .post('/trumpets')
                .send(trumpet)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('user_info_id').eql(info_id_1);
                    res.body.should.not.have.property('reply_trumpet_id');
                    res.body.should.have.property('submit_time');
                    res.body.should.have.property('text').eql("PLS POST!");
                    res.body.should.have.property('likes').eql(0);
                    res.body.should.have.property('retrumpets').eql(0);
                    res.body.should.have.property('replies').eql(0);
                    done();
                });
        });        
        // POST: valid trumpet with specific values
        it('should POST a trumpet with specific values', (done) => {
            var info_id_2 = mongoose.Types.ObjectId();
            let trumpet = {
                user_info_id: info_id_2,
                text: "PLS POST 2!",
                likes: 6,
                retrumpets: 3,
                replies: 7
            }
            chai.request(server)
                .post('/trumpets')
                .send(trumpet)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('user_info_id').eql(info_id_2);
                    res.body.should.not.have.property('reply_trumpet_id');
                    res.body.should.have.property('submit_time');
                    res.body.should.have.property('text').eql("PLS POST 2!");
                    res.body.should.have.property('likes').eql(6);
                    res.body.should.have.property('retrumpets').eql(3);
                    res.body.should.have.property('replies').eql(7);
                    done();
                });
        });
    });

    // GET/:trumpet_id: specific trumpet
    describe('/GET/:id trumpet', () => {
        it('should GET a trumpet with the provided id', (done) => {
            var info_id_3 = mongoose.Types.ObjectId();
            let trumpet = new Trumpet({
                user_info_id: info_id_3,
                text: "GET ME!",
                likes: 1,
                retrumpets: 2,
                replies: 3
            });
            trumpet.save((err, finalTrumpet) => {
                chai.request(server)
                .get('/trumpets/' + finalTrumpet.id)
                .send({trumpet_id: finalTrumpet.id})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('user_info_id').eql(finalTrumpet.user_info_id);
                    res.body.should.not.have.property('reply_trumpet_id');
                    res.body.should.have.property('submit_time');
                    res.body.should.have.property('text').eql("GET ME!");
                    res.body.should.have.property('likes').eql(1);
                    res.body.should.have.property('retrumpets').eql(2);
                    res.body.should.have.property('replies').eql(3);
                    res.body.should.have.property('_id').eql(finalTrumpet.id);
                    done();
                });
            });
        });
    });

    // PUT/:trumpet_id: increment by 1 the like count of specific trumpet
    describe('/PUT/:id trumpet likes', () => {
        it('should INCREMENT BY 1 the like count of a trumpet with provided id', (done) => {
            var info_id_4 = mongoose.Types.ObjectId();
            let trumpet = new Trumpet({
                user_info_id: info_id_4,
                text: "UPDATE MY LIKES!",
                likes: 999,
                retrumpets: 1,
                replies: 1
            });
            trumpet.save((err, finalTrumpet) => {
                chai.request(server)
                .put('trumpets/' + finalTrumpet.id + '/likes')
                .send({trumpet_id: finalTrumpet.id})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Trumpet like count successfully updated.');
                    res.body.should.have.property('likes').eql(1000);
                    res.body.should.have.property('user_info_id').eql(finalTrumpet.user_info_id);
                    res.body.should.not.have.property('reply_trumpet_id');
                    res.body.should.have.property('submit_time');
                    res.body.should.have.property('text').eql("UPDATE MY LIKES!");
                    res.body.should.have.property('retrumpets').eql(1);
                    res.body.should.have.property('replies').eql(1);
                    res.body.should.have.property('_id').eql(finalTrumpet.id);
                    done();
                });
            });
        });
    });

    // DELETE/:trumpet_id: delete trumpet with provided id
              



   



 
