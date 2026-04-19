/* eslint-disable camelcase */
import { describe, it, expect, vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import GetDetailThreadUseCase from '../GetDetailThreadUseCase.js';
import ReplyRepository from '../../../Domains/reply/ReplyRepository.js';

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the thread information correctly', async () => {
    // Arrange
    const useCasePayload = { threadId: 'thread-123', commentId: 'comment-123' };

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
        likeCount: 2,
      },
      {
        id: 'comment-456',
        username: 'dicoding',
        date: '2010-10-12',
        content: '**komentar telah dihapus**',
        is_delete: true,
        likeCount: 0,
      },
    ];

    const replyFromRepo = [
      {
        id: 'reply-123',
        comment_id: 'comment-123',
        username: 'johndoe',
        date: '2010-10-11',
        content: 'reply',
        is_delete: false,
      },
      {
        id: 'reply-456',
        comment_id: 'comment-123',
        username: 'dicoding',
        date: '2010-10-12',
        content: '**balasan telah dihapus**',
        is_delete: true,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** Mocking needed functions */
    mockThreadRepository.verifyThreadAvailability = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = vi.fn()
      .mockImplementation(() => Promise.resolve(threadFromRepo));
    mockCommentRepository.getCommentByThreadId = vi.fn()
      .mockImplementation(() => Promise.resolve(commentsFromRepo));
    mockReplyRepository.getReplyByThreadId = vi.fn()
      .mockImplementation(() => Promise.resolve(replyFromRepo));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository : mockReplyRepository
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
          likeCount: 2,
          replies : [
            {
              id: 'reply-123',
              content: 'reply',
              date: '2010-10-11',
              username: 'johndoe',
            },
            {
              id: 'reply-456',
              content: '**balasan telah dihapus**',
              date: '2010-10-12',
              username: 'dicoding',
            },
          ]
        },
        {
          id: 'comment-456',
          username: 'dicoding',
          date: '2010-10-12',
          content: '**komentar telah dihapus**',
          likeCount: 0,
          replies : []
        },
      ],
    });

    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-123');
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith('thread-123');
  });
});