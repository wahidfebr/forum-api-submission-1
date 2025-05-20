const CreatedComment = require('../../Domains/comments/entities/CreatedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async add(createComment) {
    const { threadId, owner, content } = createComment;
    const id = `comment-${this._idGenerator()}`;
    const timestamp = new Date();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $6) RETURNING id, content, owner',
      values: [id, threadId, owner, null, content, timestamp],
    };

    const result = await this._pool.query(query);

    return new CreatedComment({ ...result.rows[0] });
  }

  async findById(id) {
    const query = {
      text: 'SELECT id, thread_id as "threadId", owner FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    return { ...result.rows[0] };
  }

  async delete(id) {
    const query = {
      text: 'UPDATE comments SET deleted_at = NOW() WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }
}

module.exports = CommentRepositoryPostgres;
