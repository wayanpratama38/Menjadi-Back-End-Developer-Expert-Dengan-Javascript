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

  //   async getReplyByCommentId(commentId){
  //     return true;
  //   }

  //   async deleteReply(replyId, owner){
  //     return true;
  //   }
}

export default ReplyRepositoryPostgres;