/* eslint-disable camelcase */
import { describe, it, expect, vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import GetDetailThreadUseCase from '../GetDetailThreadUseCase.js';

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the thread information correctly', async () => {
    // Arrange
    const useCasePayload = { threadId: 'thread-123' };

    const threadFromRepo = {
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: '2010-10-10',
      username: 'username',
    };

    const commentsFromRepo = [
      {
        id: 'comment-123',
        username: 'johndoe',
        date: '2010-10-11',
        content: 'comment',
        is_delete: false,
      },
      {
        id: 'comment-456',
        username: 'dicoding',
        date: '2010-10-12',
        content: 'terhapus',
        is_delete: true,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** Mocking needed functions */
    mockThreadRepository.verifyThreadAvailability = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = vi.fn()
      .mockImplementation(() => Promise.resolve(threadFromRepo));
    mockCommentRepository.getCommentByThreadId = vi.fn()
      .mockImplementation(() => Promise.resolve(commentsFromRepo));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const detailThread = await getDetailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(detailThread).toStrictEqual({
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: '2010-10-10',
      username: 'username',
      comments: [
        {
          id: 'comment-123',
          username: 'johndoe',
          date: '2010-10-11',
          content: 'comment',
        },
        {
          id: 'comment-456',
          username: 'dicoding',
          date: '2010-10-12',
          content: '**komentar telah dihapus**',
        },
      ],
    });

    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-123');
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith('thread-123');
  });
});