import express from 'express';
import models from '../models';
import AppError from '../helpers/error';
import requireAPIKey from '../middleware/requireAPIKey';
import {
  USER_NOT_FOUND_ERROR,
  METHOD_NOT_ALLOWED_ERROR,
} from '../consts';

const router = express.Router();

router.post('/', (req, res, next) => {
  const { email, username } = req.body;
  const password = models.User.generateHash(req.body.password);

  models.User
    .create({ email, username, password })
    .then(user => res.status(201).send(user))
    .catch(error => next(error));
});

router.post('/:id', (req, res, next) => {
  const err = new AppError(METHOD_NOT_ALLOWED_ERROR, 405, 'Cannot call POST /users/:id', true);

  next(err);
});

router.get('/', (req, res, next) => {
  models.User.findAll()
    .then((users) => {
      if (users.length === 0) {
        const error = new AppError(USER_NOT_FOUND_ERROR, 404, 'No users were found', true);

        next(error);
      } else {
        res.status(201).send(users);
      }
    }).catch(error => next(error));
});

router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  models.User.find({ where: { id } }).then((user) => {
    if (!user) {
      const error = new AppError(USER_NOT_FOUND_ERROR, 404, 'No users were found with that ID', true);

      next(error);
    } else {
      res.status(201).send(user);
    }
  }).catch(error => next(error));
});

router.put('/', (req, res, next) => {
  const err = new AppError(METHOD_NOT_ALLOWED_ERROR, 405, 'Cannot call PUT /users', true);

  next(err);
});

router.put('/:id', (req, res, next) => {
  const { id } = req.params;

  const { username, email, password } = req.body;

  models.User
    .update({ username, email, password }, { where: { id } })
    .then((updateVector) => {
      const hasUpdated = !!updateVector[0];

      if (hasUpdated) {
        res.sendStatus(204);
      } else {
        const err = new AppError(USER_NOT_FOUND_ERROR, 404, 'User not found for :id', true);

        next(err);
      }
    })
    .catch(error => next(error));
});

router.patch('/', (req, res, next) => {
  const err = new AppError(METHOD_NOT_ALLOWED_ERROR, 405, 'Cannot call PATCH /users', true);

  next(err);
});

/**
 * TODO: The patch route is currently a copy of PUT.
 *       We should be able to set individual params here,
 *       unlike the put 
 */

router.patch('/:id', (req, res, next) => {
  const { id } = req.params;
  const { username } = req.body;

  models.User
    .update({ username }, { where: { id } })
    .then((updateVector) => {
      const hasUpdated = !!updateVector[0];

      if (hasUpdated) {
        res.sendStatus(204);
      } else {
        const err = new AppError(USER_NOT_FOUND_ERROR, 404, 'User not found for :id', true);

        next(err);
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.delete('/', (req, res, next) => {
  const err = new AppError(METHOD_NOT_ALLOWED_ERROR, 405, 'Cannot call DELETE /users', true);

  next(err);
});

router.delete('/:id', requireAPIKey, (req, res, next) => {
  const { id } = req.params;

  try {
    models.User
      .destroy({ where: { id } })
      .then((updateVector) => {
        const hasDeleted = !!updateVector;

        if (hasDeleted) {
          res.sendStatus(200);
        } else {
          const err = new AppError(USER_NOT_FOUND_ERROR, 404, 'User not found for :id', true);

          next(err);
        }
      })
      .catch(error => next(error));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
