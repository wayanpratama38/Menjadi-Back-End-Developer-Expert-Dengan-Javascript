import { describe, expect } from 'vitest';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import AddedComment from '../../../Domains/comments/entities/AddedComment.js';
import pool from '../../database/postgres/pool.js';
import CommentRepositoryPostgres from '../CommentRepositoryPostgres.js';
import CommentLikesTableTestHelper from '../../../../tests/CommentLikeTableTestHelper.js';

describe('CommentRepositoryPostgres', ()=> {
  afterEach(async ()=> {
    await CommentLikesTableTestHelper.cleanTable();
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
    it('should throw Error when comment not found in deleteCommentById', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepositoryPostgres.deleteCommentById('comment-999'))
        .rejects.toThrowError('COMMENT_REPOSITORY_POSTGRES.NOT_FOUND');
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

    it('should throw Error when comment not found in verifyCommentOwnership', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepositoryPostgres.verifyCommentOwnership('comment-999', 'user-123'))
        .rejects.toThrowError('COMMENT_REPOSITORY_POSTGRES.NOT_FOUND');
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

  describe('putLikeComment function', () => {
    it('should persist like and add like to database correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.putLikeComment('comment-123', 'user-123');

      const likes = await CommentLikesTableTestHelper.findLikeById('like-123');
      expect(likes).toHaveLength(1);
      expect(likes[0].comment_id).toBe('comment-123');
      expect(likes[0].user_id).toBe('user-123');
    });
  });

  describe('deleteLike function', () => {
    it('should delete like from database correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await CommentLikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', userId: 'user-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await commentRepositoryPostgres.deleteLike('comment-123', 'user-123');

      const likes = await CommentLikesTableTestHelper.findLikeById('like-123');
      expect(likes).toHaveLength(0);
    });
  });

  describe('verifyLikeStatus function', () => {
    it('should return true if like exists', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await CommentLikesTableTestHelper.addLike({ commentId: 'comment-123', userId: 'user-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const status = await commentRepositoryPostgres.verifyLikeStatus('comment-123', 'user-123');
      expect(status).toBe(true);
    });

    it('should return false if like does not exist', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const status = await commentRepositoryPostgres.verifyLikeStatus('comment-123', 'user-123');
      expect(status).toBe(false);
    });
  });
});