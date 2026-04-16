/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js';

const ReplyTableTestHelper = {
  async addReply({
    id = 'reply-123', content = 'sebuah balasan', owner = 'user-123', commentId = 'comment-123',
  }) {
    const query = {
      text: 'INSERT INTO replies(id, content, is_delete, owner, comment_id) VALUES($1, $2, $3, $4, $5)',
      values: [id, content, false, owner, commentId],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

export default ReplyTableTestHelper;