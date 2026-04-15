class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }){
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload){
    const { threadId, commentId, owner } = useCasePayload;
    // Check if the thread is avail or not
    await this._threadRepository.verifyThreadAvailability(threadId);

    // Check if the comment is avail or not
    await this._commentRepository.getCommentById(commentId);

    // Check if this is the owner of the comment
    await this._commentRepository.verifyCommentOwnership(commentId, owner);

    // Delete comment
    await this._commentRepository.deleteCommentById(commentId);
  }
}

export default DeleteCommentUseCase;