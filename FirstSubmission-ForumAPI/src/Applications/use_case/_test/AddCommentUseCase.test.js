import { describe, vi } from 'vitest';
import AddedComment from '../../../Domains/comments/entities/AddedComment';
import CommentRepository from '../../../Domains/comments/CommentRepository';
import AddComentUseCase from '../AddCommentUseCase';
import ThreadRepository from '../../../Domains/threads/ThreadRepository';


describe('AddCommentUseCase', ()=> {
  it('should orchestrating the add comment action correctly', async ()=> {
    const useCasePayload = {
      content : 'comment',
      threadId : 'thread-123',
      owner  : 'user-123'
    };

    const expectedAddedComment = new AddedComment({
      id : 'comment-123',
      content : useCasePayload.content,
      owner : useCasePayload.owner
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadAvailability = vi.fn()
      .mockImplementation(()=> Promise.resolve());

    mockCommentRepository.addComment = vi.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment));


    const addCommentUseCase = new AddComentUseCase({
      commentRepository : mockCommentRepository,
      threadRepository : mockThreadRepository
    });

    const addComment = await addCommentUseCase.execute(useCasePayload);

    expect(addComment).toStrictEqual(expectedAddedComment);
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith({
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      owner: useCasePayload.owner,
    });
  });
});