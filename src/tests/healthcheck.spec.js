'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
const assert = require('chai').assert;

const sinon = require('sinon');

const rewire = require('rewire');
const healthcheck = rewire('./../modules/healthcheck.js');

const heartbeatCounterSpy = sinon.spy();
healthcheck.__set__('serviceHeartbeatCounter', { inc: heartbeatCounterSpy });

describe('Updating service heartbeat', () => {
  it('Should increase the prometheus counter', () => {
    healthcheck.updateServiceStatus();
    assert(heartbeatCounterSpy.calledOnce);
  });
});
chai.use(chaiHttp);

describe('Testing healthcheck endpoint', () => {
  it('Should respond with code 200', (done) => {
    chai.request(healthcheck.server)
      .get('/metrics')
      .end((err, res) => {
        expect(err).to.be.a('null');
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe('Testing root endpoint', () => {
  it('Should respond with code 200', (done) => {
    chai.request(healthcheck.server)
      .get('/')
      .end((err, res) => {
        expect(err).to.be.a('null');
        expect(res).to.have.status(200);
        done();
      });
  });
});
