const request = require('supertest');
const {expect} = require('chai');
require('../../bin/www');

const agent = request.agent('http://localhost:3000');

describe('Sessions', () => {
  it('Доступ к маршрут /api/v1/notes с сессией', (done) => {
    agent.get('/api/v1/notes').end((err, req, res) => {
      expect(req.status).to.equal(200);
      done();
    });
  });

  it('Доступ к маршрут /api/v1/logs с сессией', (done) => {
    agent.get('/logs').end((err, req, res) => {
      expect(req.status).to.equal(302);
      done();
    });
  });

  it('Доступ к маршрут /api/v1/features с сессией', (done) => {
    agent.get('/api/v1/features').end((err, req, res) => {
      expect(req.status).to.equal(302);
      done();
    });
  });

  it('Доступ к маршрут /api/v1/ с сессией', (done) => {
    agent.get('/api/v1/').end((err, req, res) => {
      expect(req.status).to.equal(302);
      done();
    });
  });

  it('Доступ к маршрут /api/v1/ с сессией', (done) => {
    agent.get('/api/v1/addNotes').end((err, req, res) => {
      expect(req.status).to.equal(302);
      done();
    });
  });
});
