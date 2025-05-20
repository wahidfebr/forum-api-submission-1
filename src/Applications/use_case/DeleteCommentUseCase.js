const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);
    await this._threadRepository.isThreadExist(deleteComment.threadId);
    const comment = await this._commentRepository.findById(deleteComment.commentId);

    if (comment.threadId !== deleteComment.threadId || comment.owner !== deleteComment.owner) {
      throw new AuthorizationError('unauthorized to delete this comment');
    }

    await this._commentRepository.delete(deleteComment.commentId);
  }
}

module.exports = DeleteCommentUseCase;
