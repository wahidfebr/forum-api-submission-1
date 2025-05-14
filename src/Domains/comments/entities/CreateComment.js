class CreateComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { threadId, owner, content } = payload;

    this.threadId = threadId;
    this.owner = owner;
    this.content = content;
  }

  _verifyPayload({ threadId, content, owner }) {
    if (!threadId || !content || !owner) {
      throw new Error('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreateComment;
