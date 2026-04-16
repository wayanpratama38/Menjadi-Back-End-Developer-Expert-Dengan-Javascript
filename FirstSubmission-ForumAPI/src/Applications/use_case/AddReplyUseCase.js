import NewReply from '../../Domains/reply/entities/NewReply.js';

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }){
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload){
    const { threadId, commentId, owner, content } = new NewReply(useCasePayload);

    // Check thread availability
    await this._threadRepository.verifyThreadAvailability(threadId);

    // Check if comment exist
    await this._commentRepository.verifyCommentAvailability(commentId);

    // Insert the reply
    return await this._replyRepository.addReply({
      content,
      commentId,
      owner
    });
  }
}

export default AddReplyUseCase;