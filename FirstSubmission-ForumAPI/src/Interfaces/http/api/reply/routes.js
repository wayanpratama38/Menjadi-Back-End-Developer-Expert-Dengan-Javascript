import express from 'express';
import authenticationMiddleware from '../../../../Infrastructures/http/middleware/authentications.js';

const createReplyRouter = (handler, container) => {
  const router = express.Router();

  router.post('/:threadId/comments/:commentId/replies', authenticationMiddleware(container), handler.postReplyHandler);
  router.delete('/:threadId/comments/:commentId/replies/:replyId', authenticationMiddleware(container), handler.deleteReplyHandler);
  return router;
};

export default createReplyRouter;
