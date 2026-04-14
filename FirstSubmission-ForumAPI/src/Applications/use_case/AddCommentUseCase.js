import NewComment from '../../Domains/comments/entities/NewComment.js';

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }){
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload){
    const { content,  threadId, owner } = useCasePayload;

    const newComment = new NewComment({
      content : content
    });
    await this._threadRepository.verifyThreadAvailability(threadId);


    return await this._commentRepository.addComment({
      content : newComment.content,
      threadId,
      owner,
    });
  }
}

export default AddCommentUseCase;