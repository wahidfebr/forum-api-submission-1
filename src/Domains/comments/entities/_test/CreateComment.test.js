const CreateComment = require('../CreateComment');

describe('a CreateComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'abc',
    };

    // Action and Assert
    expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123,
      owner: true,
      content: 456,
    };

    // Action and Assert
    expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreateComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'comment-dicoding',
      owner: 'user-dicoding',
      content: 'hello world',
    };

    // Action
    const { threadId, owner, content } = new CreateComment(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
    expect(content).toEqual(payload.content);
  });
});
