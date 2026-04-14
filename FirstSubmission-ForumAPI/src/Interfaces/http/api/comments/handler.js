import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase.js';

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
  }

  async postCommentHandler(req, res, next){
    try {

      const { threadId } = req.params;
      const { id : owner } = req.user;
      const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
      const addedComment = await addCommentUseCase.execute({
        ...req.body,
        threadId,
        owner
      });

      res.status(201).json({
        status : 'success',
        data : {
          addedComment
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default CommentsHandler;