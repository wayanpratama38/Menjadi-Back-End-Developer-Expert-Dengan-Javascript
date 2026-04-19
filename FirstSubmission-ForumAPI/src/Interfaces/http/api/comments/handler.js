import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase.js';
import DeleteCommentUseCase from '../../../../Applications/use_case/DeleteCommentUseCase.js';
import LikeCommentUseCase from '../../../../Applications/use_case/LikeCommentUseCase.js';

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this);
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

  async deleteCommentHandler(req, res, next){
    try {
      const { threadId, commentId } = req.params;
      const { id : owner }  = req.user;

      const deleteCommentuseCase = this._container.getInstance(DeleteCommentUseCase.name);
      await deleteCommentuseCase.execute({ threadId, commentId, owner });

      res.status(200).json({
        status : 'success'
      });
    } catch (error) {
      next(error);
    }
  }

  async putCommentLikeHandler(req, res, next){
    try {
      const { threadId, commentId } = req.params;
      const { id : userId } = req.user;

      const likeCommentUsecase = this._container.getInstance(LikeCommentUseCase.name);
      await likeCommentUsecase.execute({ threadId, commentId, userId });

      res.status(200).json({
        status : 'success'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default CommentsHandler;