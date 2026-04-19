import { describe, it, expect, vi } from 'vitest';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import LikeCommentUseCase from '../LikeCommentUseCase.js';

describe('LikeCommentUseCase', () => {
  it('should orchestrating the add like action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyLikeStatus = vi.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockCommentRepository.putLikeComment = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteLike = vi.fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.verifyLikeStatus).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.userId);
    expect(mockCommentRepository.putLikeComment).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.userId);
    expect(mockCommentRepository.deleteLike).not.toHaveBeenCalled();
  });

  it('should orchestrating the delete like action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyLikeStatus = vi.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.deleteLike = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.putLikeComment = vi.fn()
      .mockImplementation(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await likeCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.verifyLikeStatus).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.userId);
    expect(mockCommentRepository.deleteLike).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.userId);
    expect(mockCommentRepository.putLikeComment).not.toHaveBeenCalled();
  });
});