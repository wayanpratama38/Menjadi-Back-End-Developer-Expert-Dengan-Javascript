import express from 'express';
import authenticationMiddleware from '../../../../Infrastructures/http/middleware/authentications.js';

const createCommentsRouter = (handler, container) => {
  const router = express.Router();

  router.post('/:threadId/comments', authenticationMiddleware(container), handler.postCommentHandler);
  router.delete('/:threadId/comments/:commentId', authenticationMiddleware(container), handler.deleteCommentHandler);
  router.put('/:threadId/comments/:commentId/likes', authenticationMiddleware(container), handler.putCommentLikeHandler);
  return router;
};

export default createCommentsRouter;
