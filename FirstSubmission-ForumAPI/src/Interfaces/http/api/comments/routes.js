import express from 'express';
import authenticationMiddleware from '../../../../Infrastructures/http/middleware/authentications.js';

const createCommentsRouter = (handler, container) => {
  const router = express.Router();

  router.post('/:threadId/comments', authenticationMiddleware(container), handler.postCommentHandler);

  return router;
};

export default createCommentsRouter;
