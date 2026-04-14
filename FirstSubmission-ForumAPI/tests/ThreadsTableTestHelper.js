/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js';

const ThreadsTableTestHelper = {

  async findThreadById(id) {
    const query = {
      text : 'SELECT * FROM threads WHERE id = $1',
      values : [id]
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async addThread({ id, owner, title='thread', body='body' }){
    const query = {
      text : 'INSERT INTO threads(id, owner, title, body) VALUES($1,$2,$3,$4)',
      values : [id, owner, title, body]
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE threads CASCADE');
  },
};

export default ThreadsTableTestHelper;
