const CreateComment = require('../../Domains/comments/entities/CreateComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const createComment = new CreateComment(useCasePayload);
    await this._threadRepository.isThreadExist(createComment.threadId);
    return this._commentRepository.add(createComment);
  }
}

module.exports = AddCommentUseCase;
