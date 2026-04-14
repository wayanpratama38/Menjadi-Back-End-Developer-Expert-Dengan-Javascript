import CommentRepository from '../../Domains/comments/CommentRepository.js';
import AddedComment from '../../Domains/comments/entities/AddedComment.js';


class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator){
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment){
    const { content, threadId, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text : 'INSERT INTO comments(id, thread_id, owner, content) VALUES($1,$2,$3,$4) RETURNING id, content, owner',
      values : [id, threadId, owner, content]
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }
}

export default CommentRepositoryPostgres;