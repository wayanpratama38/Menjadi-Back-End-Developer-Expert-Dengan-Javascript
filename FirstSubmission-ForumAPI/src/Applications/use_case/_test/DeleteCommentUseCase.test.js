import { describe, vi } from 'vitest';
import CommentRepository from '../../../Domains/comments/CommentRepository';
import ThreadRepository from '../../../Domains/threads/ThreadRepository';
import DeleteCommentUseCase from '../DeleteCommentUseCase';


describe('DeleteCommentUseCase', ()=> {
  it('should orchestrating the delete comment action correctly', async ()=> {
    const useCasePayload = {
      threadId : 'thread-123',
      commentId : 'comment-123',
      owner  : 'user-123'
    };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadAvailability = vi.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.getCommentById = vi.fn()
      .mockImplementation(() => Promise.resolve({
        id : 'comment-123',
        owner : 'user-123',
        content  : 'komentar'
      }));

    mockCommentRepository.verifyCommentOwnership = vi.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.deleteCommentById = vi.fn()
      .mockImplementation(() => Promise.resolve());


    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository : mockCommentRepository,
      threadRepository : mockThreadRepository
    });


    await deleteCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadAvailability)
      .toHaveBeenCalledWith(useCasePayload.threadId);

    expect(mockCommentRepository.getCommentById)
      .toHaveBeenCalledWith(useCasePayload.commentId);

    expect(mockCommentRepository.verifyCommentOwnership)
      .toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner);

    expect(mockCommentRepository.deleteCommentById)
      .toHaveBeenCalledWith(useCasePayload.commentId);
  });
});