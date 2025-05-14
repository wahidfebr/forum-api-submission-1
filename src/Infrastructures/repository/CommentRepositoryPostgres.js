const CreatedComment = require('../../Domains/comments/entities/CreatedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');

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
}

module.exports = CommentRepositoryPostgres;
