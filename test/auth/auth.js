const request = require('supertest');
const {expect} = require('chai');
require('../../bin/www');

const agent = request.agent('http://localhost:3000');

describe('Sessions', () => {
  it('Создание сессии', (done) => {
    agent.post('/api/v1/users/login')
      .send({ username: 'asd@mail.ru', password: 'asd' })
      .end((err, req, res) => {
        expect(req.headers.location).to.equal('/api/v1/notes');
        done();
      });
  });

  it('Доступ к маршрут /api/v1/notes с сессией', (done) => {
    agent.get('/api/v1/notes').end((err, req, res) => {
      expect(req.status).to.equal(200);
      done();
    });
  });

  it('Доступ к маршрут /api/v1/logs с сессией', (done) => {
    agent.get('/logs').end((err, req, res) => {
      expect(req.status).to.equal(200);
      done();
    });
  });

  it('Доступ к маршрут /api/v1/features с сессией', (done) => {
    agent.get('/api/v1/features').end((err, req, res) => {
      expect(req.status).to.equal(200);
      done();
    });
  });

  it('Доступ к маршрут /api/v1/ с сессией', (done) => {
    agent.get('/api/v1/').end((err, req, res) => {
      expect(req.status).to.equal(200);
      done();
    });
  });

  it('Доступ к маршрут /api/v1/ с сессией', (done) => {
    agent.get('/api/v1/addNotes').end((err, req, res) => {
      expect(req.status).to.equal(200);
      done();
    });
  });
  describe('Заметки', () => {
    it('Добавление c валидными данными', (done) => {
      agent.post('/api/v1/addNotes')
        .send({
          tagText: 'req.body.tagText',
          noteText: 'req.body.noteText',
          userId: 1,
          author: 'asd',
        })
        .end((err, req, res) => {
          expect(req.status).to.equal(302);
          done();
        });
    });
    it('Добавление c не валидным текстом', (done) => {
      agent.post('/api/v1/addNotes')
        .send({
          tagText: 'req.body.tagText',
          noteText: '1',
          userId: 1,
          author: 'asd',
        })
        .end((err, req, res) => {
          expect(req.status).to.equal(400);
          done();
        });
    });
    it('Добавление c не валидным тегом', (done) => {
      agent.post('/api/v1/addNotes')
        .send({
          tagText: '1',
          noteText: 'req.body.noteText',
          userId: 1,
          author: 'asd',
        })
        .end((err, req, res) => {
          expect(req.status).to.equal(400);
          done();
        });
    });

    // it('Редактирование', (done) => {
    //   agent.put('/api/v1/notes/1')
    //     .send({
    //       tagText: 'dsss',
    //     })
    //     .end((err, req, res) => {
    //       expect(req.status).to.equal(200);
    //       done();
    //     });
    // });
    // it('Удаление', (done) => {
    //   agent.delete('/api/v1/notes/1')
    //     .send({
    //       id: 1,
    //     })
    //     .end((err, req, res) => {
    //       expect(req.status).to.equal(200);
    //       done();
    //     });
    // });

    describe('Комментарии', () => {
      it('Добавление c комментария валидными данными', (done) => {
        agent.post('/api/v1/comments/create')
          .send({
            text: 'req.body.text',
            id: 1,
            author: 'asd',
            userId: 1,
          })
          .end((err, req, res) => {
            expect(req.status).to.equal(200);
            done();
          });
      });
      it('Добавление c комментария не валидным текстом', (done) => {
        agent.post('/api/v1/comments/create')
          .send({
            text: '',
            id: 1,
            author: 'asd',
            userId: 1,
          })
          .end((err, req, res) => {
            expect(req.status).to.equal(400);
            done();
          });
      });
    });
    describe('Лайки', () => {
      it('Нажимаем на лайк', (done) => {
        agent.post('/api/v1/notes/like')
          .send({
            noteId: 1,
            userId: 1,
          })
          .end((err, req, res) => {
            expect(req.status).to.equal(200);
            done();
          });
      });
    });
  });
});
