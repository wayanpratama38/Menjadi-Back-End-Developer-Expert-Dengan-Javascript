import { expect, vi } from 'vitest';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import AddedReply from '../../../Domains/reply/entities/AddedReply.js';
import ReplyRepository from '../../../Domains/reply/ReplyRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddReplyUseCase from '../AddReplyUseCase.js';


describe('AddReplyUseCase', ()=> {
  it('should orchestrating the reply comment correctly', async () => {
    const useCasePayload = {
      threadId : 'thread-123',
      content : 'balasan',
      owner : 'user-123',
      commentId : 'comment-123'
    };

    const expectedAddedReply = new AddedReply({
      id : 'reply-123',
      content : useCasePayload.content,
      owner : useCasePayload.owner
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadAvailability = vi.fn()
      .mockImplementation(()=>Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = vi.fn()
      .mockImplementation(()=>Promise.resolve());
    mockReplyRepository.addReply = vi.fn()
      .mockImplementation(()=>Promise.resolve(new AddedReply({
        id : 'reply-123',
        content : useCasePayload.content,
        owner  : useCasePayload.owner
      })));

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository : mockThreadRepository,
      replyRepository : mockReplyRepository,
      commentRepository : mockCommentRepository
    });

    const addedReply = await addReplyUseCase.execute(useCasePayload);

    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.addReply).toBeCalledWith({
      content: useCasePayload.content,
      commentId: useCasePayload.commentId,
      owner: useCasePayload.owner,
    });
  });
});