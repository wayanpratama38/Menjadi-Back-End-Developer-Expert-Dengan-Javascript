import { describe, expect } from 'vitest';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import AddedComment from '../../../Domains/comments/entities/AddedComment.js';
import pool from '../../database/postgres/pool.js';
import CommentRepositoryPostgres from '../CommentRepositoryPostgres.js';

describe('CommentRepositoryPostgres', ()=> {
  afterEach(async ()=> {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment functionallity', ()=>{
    it('should add comment into database', async () =>{
      const userId = 'user-123';
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      const newComment = {
        content: 'sebuah komentar',
        threadId: threadId,
        owner: userId,
      };

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'sebuah komentar',
        owner: userId,
      }));
    });
  });

  describe('deleteComment functionallity', ()=> {
    it('should soft delete comment in database', async ()=> {
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id : userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      await CommentsTableTestHelper.addComment({ id: commentId, threadId: threadId, owner: userId });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await commentRepositoryPostgres.deleteCommentById(commentId);

      const comments = await CommentsTableTestHelper.findCommentsById(commentId);
      expect(comments).toHaveLength(1);
      expect(comments[0].is_delete).toEqual(true);
    });
  });

  describe('getCommentById function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepositoryPostgres.getCommentById('comment-999'))
        .rejects.toThrowError('COMMENT_REPOSITORY_POSTGRES.NOT_FOUND');
    });

    it('should return comment detail correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const comment = await commentRepositoryPostgres.getCommentById('comment-123');

      expect(comment.id).toEqual('comment-123');
      expect(comment.content).toBeDefined();
    });
  });

  describe('verifyCommentOwnership function', () => {
    it('should throw UnauthorizedError when owner not match', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-1' });
      await UsersTableTestHelper.addUser({ id: 'user-2', username: 'other' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-1', owner: 'user-1' });
      await CommentsTableTestHelper.addComment({ id: 'comment-1', threadId: 'thread-1', owner: 'user-1' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepositoryPostgres.verifyCommentOwnership('comment-1', 'user-2'))
        .rejects.toThrowError('COMMENT_REPOSITORY_POSTGRES.UNAUTHORIZED');
    });
  });

  describe('veriyCommentAvailability function', () => {
    it('should throw NotFoundError when comment not founded', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-1' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-1', owner: 'user-1' });
      await CommentsTableTestHelper.addComment({ id: 'comment-2', threadId: 'thread-1', owner: 'user-1' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-1'))
        .rejects.toThrowError('COMMENT_REPOSITORY_POSTGRES.NOT_FOUND');
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should return comments by thread id correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'johndoe' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-1', owner: 'user-1' });
      await CommentsTableTestHelper.addComment({ id: 'comment-1', threadId: 'thread-1', owner: 'user-1' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const comments = await commentRepositoryPostgres.getCommentByThreadId('thread-1');

      expect(comments).toHaveLength(1);
      expect(comments[0].username).toEqual('johndoe');
    });
  });
});