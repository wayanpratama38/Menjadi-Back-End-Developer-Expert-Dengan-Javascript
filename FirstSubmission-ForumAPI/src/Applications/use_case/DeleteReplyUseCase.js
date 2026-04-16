class DeleteReplyUseCase{
  constructor({ replyRepository, threadRepository, commentRepository }){
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload){
    const { threadId, commentId, replyId, owner } = useCasePayload;

    // Verify if the thread exist
    await this._threadRepository.verifyThreadAvailability(threadId);

    // Verify if the comment exist
    await this._commentRepository.verifyCommentAvailability(commentId);

    // Verify if the user are the owner of reply
    await this._replyRepository.verifyReplyOwnership(replyId, owner);

    // Soft delete the information
    await this._replyRepository.deleteReply(replyId);
  }
}

export default DeleteReplyUseCase;