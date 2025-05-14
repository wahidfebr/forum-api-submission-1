const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      owner: 'user-dicoding',
    };

    const mockCreatedThread = new CreatedThread({
      id: 'thread-dicoding',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.add = jest.fn()
      .mockImplementation(() => Promise.resolve(
        mockCreatedThread,
      ));

    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const createdThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(createdThread).toStrictEqual(new CreatedThread({
      id: 'thread-dicoding',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    }));

    expect(mockThreadRepository.add).toBeCalledWith(new CreateThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    }));
  });
});
