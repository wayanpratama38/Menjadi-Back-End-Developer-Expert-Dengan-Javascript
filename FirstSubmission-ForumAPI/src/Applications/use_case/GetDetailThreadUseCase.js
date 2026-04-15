class GetDetailThreadUseCase{
  constructor({ threadRepository, commentRepository }){
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload){
    const { threadId } = useCasePayload;

    // Check if the thread avail or not
    await this._threadRepository.verifyThreadAvailability(threadId);

    // Get the thread detail information
    const thread = await this._threadRepository.getThreadById(threadId);

    // Get all the comment in the thread
    const comments = await this._commentRepository.getCommentByThreadId(threadId);

    // returning the thread information
    return {
      id : thread.id,
      title : thread.title,
      body : thread.body,
      date : thread.date,
      username : thread.username,
      comments : comments.map((comment)=>({
        id : comment.id,
        username : comment.username,
        date : comment.date,
        content : comment.is_delete ? '**komentar telah dihapus**' : comment.content,
      }))
    };

  }
}

export default GetDetailThreadUseCase;