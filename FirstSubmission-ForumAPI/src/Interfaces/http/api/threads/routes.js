import express from 'express';
import authenticationMiddleware from '../../../../Infrastructures/http/middleware/authentications.js';

const createThreadsRouter = (handler, container) => {
  const router = express.Router();

  router.post('/', authenticationMiddleware(container), handler.postThreadHandler);
  router.get('/:threadId', handler.getDetailThreadHandler);
  return router;
};

export default createThreadsRouter;
