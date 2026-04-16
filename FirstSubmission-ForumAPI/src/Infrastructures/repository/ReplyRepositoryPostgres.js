import ReplyRepository from '../../Domains/reply/ReplyRepository.js';

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator){
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply){
    const { content, commentId, owner } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const query = {
      text : 'INSERT INTO replies(id, content, owner, comment_id) VALUES($1,$2,$3,$4) returning id, content, owner',
      values : [id, content, owner, commentId]
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getReplyByThreadId(threadId){
    const query  = {
      text : `
            SELECT
            replies.id,
            replies.content,
            replies.date,
            replies.is_delete,
            replies.comment_id, 
            users.username
        FROM replies
        INNER JOIN users ON replies.owner = users.id
        INNER JOIN comments ON replies.comment_id = comments.id 
        WHERE comments.thread_id = $1
        ORDER BY replies.date ASC
      `,
      values : [threadId]
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyReplyOwnership(replyId, owner){
    const query = {
      text : 'SELECT * FROM replies WHERE id = $1',
      values : [replyId]
    };

    const result = await this._pool.query(query);

    // check if the reply founded or not
    if (!result.rowCount){
      throw new Error('REPLY_REPOSITORY_POSTGRES.NOT_FOUND');
    }

    // check if the users is also owned this reply
    if (result.rows[0].owner !== owner){
      throw new Error('REPLY_REPOSITORY_POSTGRES.UNAUTHORIZED');
    }

    return result.rowCount > 0 ? true : false;
  }

  async deleteReply(replyId){
    const query = {
      text : 'UPDATE replies SET is_delete = true WHERE id = $1',
      values : [replyId]
    };

    await this._pool.query(query);
  }
}

export default ReplyRepositoryPostgres;