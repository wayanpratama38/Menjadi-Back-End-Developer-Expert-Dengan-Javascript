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

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

export default ThreadsTableTestHelper;
