// src/Infrastructures/http/middleware/authentication.js
import AuthenticationTokenManager from '../../../Applications/security/AuthenticationTokenManager.js';


const authenticationMiddleware = (container) => async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      status: 'fail',
      message: 'Missing authentication',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const tokenManager = container.getInstance(AuthenticationTokenManager.name);
    const { id } = await tokenManager.verifyAccessToken(token);
    req.user = { id };
    next();
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token',
    });
  }
};

export default authenticationMiddleware;