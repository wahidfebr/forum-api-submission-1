const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-dicoding',
      owner: 'user-dicoding',
      content: 'Dicoding Indonesia',
    };

    const mockCreatedComment = new CreatedComment({
      id: 'comment-dicoding',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockCommentRepository.add = jest.fn()
      .mockImplementation(() => Promise.resolve(
        mockCreatedComment,
      ));
    mockThreadRepository.isThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve(
        true
      ));

    /** creating use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    });

    // Action
    const createdComment = await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(createdComment).toStrictEqual(new CreatedComment({
      id: 'comment-dicoding',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));

    expect(mockCommentRepository.add).toBeCalledWith(new CreateComment({
      threadId: useCasePayload.threadId,
      owner: useCasePayload.owner,
      content: useCasePayload.content,
    }));

    expect(mockThreadRepository.isThreadExist).toBeCalledWith(useCasePayload.threadId);
  });
});
