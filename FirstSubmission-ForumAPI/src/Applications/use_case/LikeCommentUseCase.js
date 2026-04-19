class LikeCommentUseCase{
  constructor({ commentRepository, threadRepository }){
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  };

  async execute(useCasePayload){
    const { threadId, commentId, userId } = useCasePayload;

    // Check if the thread exist
    await this._threadRepository.verifyThreadAvailability(threadId);

    // Check if the comment exist
    await this._commentRepository.verifyCommentAvailability(commentId);

    // Check if the user already like or not
    const flag = await this._commentRepository.verifyLikeStatus(commentId, userId);

    // if already like then delete like
    // else add like
    flag
      ? await this._commentRepository.deleteLike(commentId, userId)
      : await this._commentRepository.putLikeComment(commentId, userId);
  }


}

export default LikeCommentUseCase;