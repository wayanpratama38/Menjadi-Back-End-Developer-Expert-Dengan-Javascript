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
      text : 'SELECT * FROM comments WHERE id = $1',
      values : [commentId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount){
      throw new Error('COMMENT_REPOSITORY_POSTGRES.NOT_FOUND');
    }

    if (result.rows[0].owner !== owner){
      throw new Error('COMMENT_REPOSITORY_POSTGRES.UNAUTHORIZED');
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

  async getCommentByThreadId(threadId){
    const query = {
      text : `
        SELECT
          comments.id,
          users.username,
          comments.date,
          comments.content,
          comments.is_delete,
          CAST(COUNT(comment_likes.id) AS INTEGER) AS "likeCount"
        FROM comments
        INNER JOIN users ON comments.owner = users.id
        LEFT JOIN comment_likes ON comments.id = comment_likes.comment_id
        WHERE comments.thread_id = $1
        GROUP BY comments.id, users.username
        ORDER BY comments.date ASC
      `,
      values : [threadId]
    };

    const result = await this._pool.query(query);

    return result.rows;

  }

  async verifyCommentAvailability(commentId){
    const query = {
      text : 'SELECT * FROM comments WHERE id = $1',
      values : [commentId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount){
      throw new Error('COMMENT_REPOSITORY_POSTGRES.NOT_FOUND');
    }

    return result.rowCount > 0 ? true : false;
  }

  async putLikeComment(commentId, owner){
    const id = `like-${this._idGenerator()}`;
    const query = {
      text : 'INSERT INTO comment_likes(id,comment_id,user_id) VALUES($1, $2, $3)',
      values : [id, commentId, owner]
    };

    await this._pool.query(query);
  }

  async deleteLike(commentId, owner){
    const query = {
      text : 'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values : [commentId, owner]
    };

    await this._pool.query(query);
  }

  async verifyLikeStatus(commentId, owner){
    const query = {
      text : 'SELECT * FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values : [commentId, owner]
    };

    const result = await this._pool.query(query);
    return result.rowCount > 0 ? true : false;
  }
}

export default CommentRepositoryPostgres;