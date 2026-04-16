import ReplyTableTestHelper from '../../../../tests/ReplyTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import ReplyRepositoryPostgres from '../ReplyRepositoryPostgres.js';

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await ReplyTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist reply and return added reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const newReply = {
        content: 'sebuah balasan',
        commentId: 'comment-123',
        owner: 'user-123',
      };
      const fakeIdGenerator = () => '123';
      const repository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await repository.addReply(newReply);

      // Assert
      const replies = await ReplyTableTestHelper.findReplyById('reply-123');
      expect(replies).toHaveLength(1);
      expect(addedReply.id).toEqual('reply-123');
      expect(addedReply.content).toEqual(newReply.content);
      expect(addedReply.owner).toEqual(newReply.owner);
    });
  });

  describe('getReplyByThreadId function', () => {
    it('should return replies by thread id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'johndoe' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await ReplyTableTestHelper.addReply({
        id: 'reply-123', content: 'balasan A', commentId: 'comment-123', owner: 'user-123',
      });

      const repository = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await repository.getReplyByThreadId('thread-123');

      // Assert
      expect(replies).toHaveLength(1);
      expect(replies[0].id).toEqual('reply-123');
      expect(replies[0].username).toEqual('johndoe');
      expect(replies[0].comment_id).toEqual('comment-123');
      expect(replies[0].content).toEqual('balasan A');
    });
  });

  describe('verifyReplyOwnership function', () => {
    it('should throw Error when reply not found', async () => {
      const repository = new ReplyRepositoryPostgres(pool, {});
      await expect(repository.verifyReplyOwnership('reply-999', 'user-123'))
        .rejects.toThrowError('REPLY_REPOSITORY_POSTGRES.NOT_FOUND');
    });

    it('should throw Error when user is not the owner', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'other' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await ReplyTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });

      const repository = new ReplyRepositoryPostgres(pool, {});
      await expect(repository.verifyReplyOwnership('reply-123', 'user-456'))
        .rejects.toThrowError('REPLY_REPOSITORY_POSTGRES.UNAUTHORIZED');
    });

    it('should not throw Error when user is the owner', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await ReplyTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });

      const repository = new ReplyRepositoryPostgres(pool, {});
      await expect(repository.verifyReplyOwnership('reply-123', 'user-123'))
        .resolves.not.toThrowError();
    });
  });

  describe('deleteReply function', () => {
    it('should update is_delete column to true', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await ReplyTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });

      const repository = new ReplyRepositoryPostgres(pool, {});
      await repository.deleteReply('reply-123');

      const replies = await ReplyTableTestHelper.findReplyById('reply-123');
      expect(replies[0].is_delete).toBe(true);
    });
  });
});