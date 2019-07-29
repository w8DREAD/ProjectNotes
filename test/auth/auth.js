const request = require('supertest');
const expect = require('chai').expect;
require('../../bin/www');

const agent = request.agent('http://localhost:3000');

describe('Sessions', () => {
  it('Should create a session', (done) => {
    agent.post('/api/v1/users/login')
      .send({ username: 'asd', password: 'asd' })
      .end((err, req, res) => {
        expect(req.headers.location).to.equal('/api/v1/notes');
        done();
      });
  });

  it('Should return the current session', (done) => {
    agent.get('/api/v1/notes').end((err, req, res) => {
      expect(req.status).to.equal(200);
      done();
    });
  });
});
