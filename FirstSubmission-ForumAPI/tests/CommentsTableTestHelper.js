/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js';

const CommentsTableTestHelper = {

  async addComment({ id, threadId, content='komentar', owner }){
    const query = {
      text : 'INSERT INTO comments(id,thread_id,content,owner) VALUES($1,$2,$3,$4)',
      values : [id, threadId, content, owner]
    };

    await pool.query(query);
  },

  async findCommentsById(id) {
    const query = {
      text : 'SELECT * FROM comments WHERE id=$1',
      values : [id]
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE comments CASCADE');
  },
};

export default CommentsTableTestHelper;
