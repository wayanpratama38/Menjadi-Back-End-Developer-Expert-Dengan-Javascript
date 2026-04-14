import { afterAll, afterEach, describe, expect } from 'vitest';
import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres.js';
import pool from '../../database/postgres/pool.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';


describe('ThreadRepositoryPostgres', ()=> {
  afterEach(async ()=> {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
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
});

