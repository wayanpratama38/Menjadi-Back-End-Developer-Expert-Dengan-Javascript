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

  async verifyCommentOwnership(commentId, owner){
    const query = {
      text : 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values : [commentId, owner]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount){
      throw new Error('COMMENT_REPOSITORY_POSTGRES.NOT_FOUND');
    }

    return result.rowCount > 0 ? true : false;
  }

  async getCommentById(commentId){
    const query = {
      text : 'SELECT * FROM comments WHERE id = $1',
      values : [commentId]
    };

    const result = await this._pool.query(query);
    if (!result.rowCount){
      throw new Error('COMMENT_REPOSITORY_POSTGRES.NOT_FOUND');
    }

    return result.rows[0];
  }

  async deleteCommentById(commentId){
    const query = {
      text : 'UPDATE comments SET is_delete = true WHERE id = $1',
      values : [commentId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount){
      throw new Error('COMMENT_REPOSITORY_POSTGRES.NOT_FOUND');
    }
  }
}

export default CommentRepositoryPostgres;