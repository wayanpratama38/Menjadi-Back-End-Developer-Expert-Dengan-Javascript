import { afterAll, afterEach, describe, expect } from 'vitest';
import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres.js';
import pool from '../../database/postgres/pool.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';


describe('ThreadRepositoryPostgres', ()=> {
  afterEach(async ()=> {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async ()=> {
    await pool.end();
  });

  describe('Add new thread', ()=> {
    it('should add thread into database', async ()=> {

      const ownerId = 'user-123';
      await UsersTableTestHelper.addUser({ id : ownerId, username : 'wynprtm' });

      const newThread = {
        title : 'title',
        body : 'body',
        owner : ownerId
      };

      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepository.addThread(newThread);

      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
      expect(threads[0].id).toBe('thread-123');
      expect(threads[0].title).toBe(newThread.title);
      expect(threads[0].owner).toBe(ownerId);
    });
  });

  describe('verifyThreadAvailability function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await expect(threadRepositoryPostgres.verifyThreadAvailability('thread-999'))
        .rejects.toThrowError('THREAD_REPOSITORY_POSTGRES.NOT_FOUND');
    });

    it('should not throw NotFoundError when thread exists', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyThreadAvailability('thread-123'))
        .resolves.not.toThrowError();
    });
  });

  describe('getThreadById function', () => {
    it('should return thread detail correctly', async () => {
      const userId = 'user-123';
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const thread = await threadRepositoryPostgres.getThreadById(threadId);

      expect(thread.id).toEqual(threadId);
      expect(thread.username).toEqual('dicoding');
      expect(thread.title).toBeDefined();
      expect(thread.body).toBeDefined();
      expect(thread.date).toBeDefined();
    });
  });
});

