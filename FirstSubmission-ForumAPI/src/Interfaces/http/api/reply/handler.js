import AddReplyUseCase from '../../../../Applications/use_case/AddReplyUseCase.js';

class ReplyHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
  }

  async postReplyHandler(req, res, next){
    try {
      const { threadId, commentId } = req.params;
      const { id : owner } = req.user;
      const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
      const addedReply = await addReplyUseCase.execute({
        ...req.body,
        threadId,
        owner,
        commentId
      });

      res.status(201).json({
        status : 'success',
        data : {
          addedReply
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // async deleteCommentHandler(req, res, next){
  //   try {
  //     const { threadId, commentId } = req.params;
  //     const { id : owner }  = req.user;
  //     // console.log(threadId, commentId, owner);

  //     const deleteCommentuseCase = this._container.getInstance(DeleteCommentUseCase.name);
  //     // console.log(deleteCommentuseCase);
  //     await deleteCommentuseCase.execute({ threadId, commentId, owner });

  //     res.status(200).json({
  //       status : 'success'
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}

export default ReplyHandler;