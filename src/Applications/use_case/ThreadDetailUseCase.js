class ThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const thread = await this._threadRepository.findById(
      useCasePayload.threadId,
    );
    const comments = await this._commentRepository.findAllCommentsOnThread(
      useCasePayload.threadId,
    );

    return {
      ...thread,
      comments: comments.map((el) => ({
        ...el,
        content: el.deletedAt ? '**komentar telah dihapus**' : el.content,
        deletedAt: undefined,
      })),
    };
  }
}

module.exports = ThreadDetailUseCase;
