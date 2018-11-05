import { API_KEY } from '../consts';

const requireAPIKey = (req, res, next) => {
  const { headers: { 'x-api-key': headersAPIKey } } = req;

  if (headersAPIKey !== API_KEY) {
    return res.send(401);
  }

  return next();
};

export default requireAPIKey;
