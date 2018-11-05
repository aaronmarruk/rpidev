import {
  NOT_UNIQUE_ERROR,
  VALIDATION_ERROR,
  USER_NOT_FOUND_ERROR,
  METHOD_NOT_ALLOWED_ERROR,
} from '../consts';

const printStack = (error) => {
  if (process.env.NODE_ENV !== 'test') {
    /* eslint-disable-next-line */
    console.error('Stack trace:', error.stack);
  }
};

/* eslint-disable-next-line */
const handleErrors = (err, req, res, next) => {
  const error = err;

  if (res.headersSent) {
    return next(error);
  }

  const errorConfigByType = {
    [NOT_UNIQUE_ERROR]: () => {
      printStack(error);

      return res.status(409).send(error);
    },
    [VALIDATION_ERROR]: () => {
      printStack(error);

      return res.status(400).send(error);
    },
    [USER_NOT_FOUND_ERROR]: () => {
      printStack(error);

      return res.status(404).send(error);
    },
    [METHOD_NOT_ALLOWED_ERROR]: () => {
      printStack(error);

      return res.status(405).send(error);
    },
  };

  if (typeof errorConfigByType[error.name] !== 'undefined') {
    errorConfigByType[error.name]();
  }

  if (!error.statusCode) error.statusCode = 500;

  return res.status(error.statusCode).send(error.description || error.message);
};

export default handleErrors;
