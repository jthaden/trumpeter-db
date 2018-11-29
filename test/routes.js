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



 
