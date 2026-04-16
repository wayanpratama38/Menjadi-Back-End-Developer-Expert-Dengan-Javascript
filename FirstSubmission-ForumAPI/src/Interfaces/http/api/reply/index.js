import ReplyHandler from './handler.js';
import createReplyRouter from './routes.js';

export default (container) => {
  const replyHandler = new ReplyHandler(container);
  return createReplyRouter(replyHandler, container);
};
