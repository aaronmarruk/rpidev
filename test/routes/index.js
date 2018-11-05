/* global it, describe, before, beforeEach */
import 'babel-polyfill';
import supertest from 'supertest';
import app from '../..';
import models from '../../models';
import {
  API_KEY,
} from '../../consts';

const request = supertest(app);

describe('User API', () => {
  before(() => models.sequelize.sync());

  beforeEach(async () => {
    await models.User.destroy({ truncate: true });

    return true;
  });

  const user1 = {
    username: 'Terry',
    email: 'terry@test.com',
    password: 'super!',
  };

  const user1Edited = {
    username: 'EDITED Terry',
    email: 'terry@test.com',
    password: 'super!',
  };

  describe('GET /users', () => {
    it("Returns the correct status when no users are found'", (done) => {
      request
        .get('/users')
        .expect(404)
        .end(done);
    });

    it("Returns the correct error when no users are found'", (done) => {
      request
        .get('/users')
        .expect(/UserNotFoundError/)
        .end(done);
    });

    it("Returns the correct status when users are found'", (done) => {
      // First add a user
      request
        .post('/users')
        .send(user1)
        // Then look up users
        .then(() => {
          request
            .get('/users')
            .expect(201)
            .end(done);
        });
    });

    it("Returns the correct users in response when available'", (done) => {
      // First add a user
      request
        .post('/users')
        .send(user1)
        // Then look up users
        .then(() => {
          request
            .get('/users')
            .expect(/Terry/)
            .end(done);
        });
    });
  });

  describe('GET /users/:id', () => {
    it("Returns the correct status when a user is found for :id'", (done) => {
      // First add a user
      request
        .post('/users')
        .send(user1)
        // Then get the user by ID and look at the status code
        .then((res) => {
          const { id } = res.body;

          request
            .get(`/users/${id}`)
            .expect(201)
            .end(done);
        });
    });

    it("Returns the correct user when a user is found for :id'", (done) => {
      // First add a user
      request
        .post('/users')
        .send(user1)
        // Then get the user by ID and look at the username
        .then((res) => {
          const { id } = res.body;

          request
            .get(`/users/${id}`)
            .expect(/Terry/)
            .end(done);
        });
    });

    it("Returns the correct status when no users were found'", (done) => {
      request
        .post('/users')
        .send({ username: 'Terry' })
        .then(() => {
          request
            .get('/users/not-exist')
            .expect(404)
            .end(done);
        });
    });

    it("Returns the correct error when no users were found'", (done) => {
      request
        .post('/users')
        .send({ username: 'Terry' })
        .then(() => {
          request
            .get('/users/not-exist')
            .expect(/UserNotFoundError/)
            .end(done);
        });
    });

    it("Doesn't return a user if not found'", (done) => {
      request
        .post('/users')
        .send({ username: 'Terry' })
        .then(() => {
          request
            .get('/users/not-exist')
            .expect(/^((?!Terry).)*$/)
            .end(done);
        });
    });
  });

  describe('POST /users', () => {
    it("Returns 201 if a user is created'", (done) => {
      request
        .post('/users')
        .send({
          username: 'Terry',
          email: 'terrythebaker@example.com',
        })
        .expect(201)
        .end(done);
    });

    it("Returns the new user if created'", (done) => {
      request
        .post('/users')
        .send({
          username: 'Terry',
          email: 'terrythebaker@example.com',
        })
        .expect(/Terry/)
        .end(done);
    });

    it("Returns 409 if a duplicate user is registered'", (done) => {
      request
        .post('/users')
        .send({
          username: 'Terry',
          email: 'terrythebaker@example.com',
        })
        .then(() => {
          request
            .post('/users')
            .send({
              username: 'Terry',
              email: 'terrythebaker@example.com',
            })
            .expect(409)
            .end(done);
        });
    });

    it("Returns the duplicate user on 409'", (done) => {
      request
        .post('/users')
        .send({
          username: 'Terry',
          email: 'terrythebaker@example.com',
        })
        .then(() => {
          request
            .post('/users')
            .send({
              username: 'Terry',
              email: 'terrythebaker@example.com',
            })
            .expect(/Terry/)
            .end(done);
        });
    });

    it("Returns correct error if a duplicate user is registered'", (done) => {
      request
        .post('/users')
        .send({
          username: 'Terry',
          email: 'terrythebaker@example.com',
        })
        .then(() => {
          request
            .post('/users')
            .send({
              username: 'Terry',
              email: 'terrythebaker@example.com',
            })
            .expect(/SequelizeUniqueConstraintError/)
            .end(done);
        });
    });
  });

  describe('POST /users/:id', () => {
    it("Returns 405'", (done) => {
      request
        .post('/users/a-user-id')
        .send({
          username: 'Terry',
          email: 'terrythebaker@example.com',
        })
        .expect(405)
        .end(done);
    });
  });

  describe('PUT /users', () => {
    it("Returns the correct status code'", (done) => {
      request
        .put('/users')
        .send({
          username: 'Terry',
          email: 'terrythebaker@example.com',
        })
        .expect(405)
        .end(done);
    });

    it("Returns the correct error'", (done) => {
      request
        .put('/users')
        .send({
          username: 'Terry',
          email: 'terrythebaker@example.com',
        })
        .expect(/MethodNotAllowedError/)
        .end(done);
    });
  });

  describe('PUT /users/:id', () => {
    it("Returns the correct status code'", (done) => {
      request
        .post('/users')
        .send(user1)
        // Then get the user by ID and look at the username
        .then((res) => {
          const { id } = res.body;

          request
            .put(`/users/${id}`)
            .send(user1Edited)
            .expect(204)
            .end(done);
        });
    });

    it("Returns the correct status code when no user found'", (done) => {
      request
        .post('/users')
        .send(user1)
        // Then get the user by ID and look at the username
        .then(() => {
          const id = 'ID_THAT_DOESNT_EXIST';

          request
            .put(`/users/${id}`)
            .send(user1Edited)
            .expect(404)
            .end(done);
        });
    });
  });

  describe('PATCH /users', () => {
    it("Returns the correct status code'", (done) => {
      request
        .patch('/users')
        .send({
          username: 'Terry',
          email: 'terrythebaker@example.com',
        })
        .expect(405)
        .end(done);
    });

    it("Returns the correct error'", (done) => {
      request
        .patch('/users')
        .send({
          username: 'Terry',
          email: 'terrythebaker@example.com',
        })
        .expect(/MethodNotAllowedError/)
        .end(done);
    });
  });

  describe('PATCH /users/:id', () => {
    it("Returns the correct status code'", (done) => {
      request
        .post('/users')
        .send(user1)
        // Then get the user by ID and look at the username
        .then((res) => {
          const { id } = res.body;

          request
            .patch(`/users/${id}`)
            .send(user1Edited)
            .expect(204)
            .end(done);
        });
    });

    it("Returns the correct status code when no user found'", (done) => {
      request
        .post('/users')
        .send(user1)
        // Then get the user by ID and look at the username
        .then(() => {
          const id = 'ID_THAT_DOESNT_EXIST';

          request
            .patch(`/users/${id}`)
            .send(user1Edited)
            .expect(404)
            .end(done);
        });
    });
  });

  describe('DELETE /users', () => {
    it("Returns the correct status code'", (done) => {
      request
        .delete('/users')
        .expect(405)
        .end(done);
    });

    it("Returns the correct error'", (done) => {
      request
        .delete('/users')
        .expect(/MethodNotAllowedError/)
        .end(done);
    });
  });

  describe('DELETE /users/:id', () => {
    it("Returns the correct status code'", (done) => {
      // First add a user
      request
        .post('/users')
        .send(user1)
        // Then get the user by ID and look at the username
        .then((res) => {
          const { id } = res.body;

          request
            .delete(`/users/${id}`)
            .set('X-API-KEY', API_KEY)
            .expect(200)
            .end(done);
        });
    });

    it("Returns the correct status code'", (done) => {
      // First add a user
      request
        .post('/users')
        .send(user1)
        // Then get the user by ID and look at the username
        .then(() => {
          const id = 'Doesn\'t exist';

          request
            .delete(`/users/${id}`)
            .set('X-API-KEY', API_KEY)
            .expect(404)
            .end(done);
        });
    });

    it("Returns unauthorized if no API key given in headers'", (done) => {
      // First add a user
      request
        .post('/users')
        .send(user1)
        // Then get the user by ID and look at the username
        .then(() => {
          const id = 'Doesn\'t exist';

          request
            .delete(`/users/${id}`)
            .expect(401)
            .end(done);
        });
    });
  });
});
