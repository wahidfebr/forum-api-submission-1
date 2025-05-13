const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should return added thread correctly', async () => {
      // Arrange
      const userId = 'user-dicoding';
      await UsersTableTestHelper.addUser({ id: userId });
      const createThread = new CreateThread({
        title: 'dicoding',
        body: 'Dicoding Indonesia',
        owner: userId,
      });
      const fakeIdGenerator = () => 'dicoding';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdThread = await threadRepositoryPostgres.add(createThread);

      // Assert
      const thread = await ThreadsTableTestHelper.findById(createdThread.id);
      expect(thread).toHaveLength(1);
      expect(createdThread).toStrictEqual(new CreatedThread({
        id: `thread-${fakeIdGenerator()}`,
        title: createThread.title,
        owner: createThread.owner,
      }));
    });
  });
});