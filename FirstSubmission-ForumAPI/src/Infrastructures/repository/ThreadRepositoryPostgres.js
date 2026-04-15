import AddedThread from '../../Domains/threads/entities/AddedThread.js';
import ThreadRepository from '../../Domains/threads/ThreadRepository.js';

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator){
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  };

  async addThread(newThread){
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text : 'INSERT INTO threads VALUES($1,$2,$3,$4) RETURNING id, title, body, owner',
      values : [id, title, body, owner]
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }


  async verifyThreadAvailability(threadId){
    const query = {
      text : 'SELECT * FROM threads WHERE id = $1',
      values : [threadId]
    };
    const result = (await this._pool.query(query)).rowCount > 0 ? true : false;
    if (!result) {
      throw new Error('THREAD_REPOSITORY_POSTGRES.NOT_FOUND');
    }

    return result;
  }

  async getThreadById(threadId){
    const query = {
      text : `
        SELECT 
          users.username,
          threads.id,
          threads.owner,
          threads.title,
          threads.body,
          threads.date
        FROM threads
        INNER JOIN users ON users.id = threads.owner
        WHERE threads.id = $1
      `,
      values : [threadId]
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }
}

export default ThreadRepositoryPostgres;