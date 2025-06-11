const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CreateThread = require("../../../Domains/threads/entities/CreateThread");
const CreatedThread = require("../../../Domains/threads/entities/CreatedThread");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");

describe("ThreadRepositoryPostgres", () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe("addThread function", () => {
        it("should return added thread correctly", async () => {
            // Arrange
            const userId = "user-dicoding";
            await UsersTableTestHelper.addUser({ id: userId });
            const createThread = new CreateThread({
                title: "dicoding",
                body: "Dicoding Indonesia",
                owner: userId,
            });
            const fakeIdGenerator = () => "dicoding";
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            // Action
            const createdThread = await threadRepositoryPostgres.add(
                createThread
            );

            // Assert
            const thread = await ThreadsTableTestHelper.findById(
                createdThread.id
            );
            expect(thread).toHaveLength(1);
            expect(createdThread).toStrictEqual(
                new CreatedThread({
                    id: `thread-${fakeIdGenerator()}`,
                    title: createThread.title,
                    owner: createThread.owner,
                })
            );
        });
    });

    describe("isThreadExist function", () => {
        it("should return true when thread exist", async () => {
            // Arrange
            const userId = "user-dicoding";
            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.add({
                id: "thread-dicoding",
                owner: userId,
            });

            const fakeIdGenerator = () => "dicoding";
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            // Action
            const isThreadExist = await threadRepositoryPostgres.isThreadExist(
                "thread-dicoding"
            );

            // Assert
            expect(isThreadExist).toStrictEqual(true);
        });

        it("should throw NotFoundError when thread does not exist", async () => {
            // Arrange
            const fakeIdGenerator = () => "dicoding";
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            // Act & Assert
            await expect(
                threadRepositoryPostgres.isThreadExist("non-existent-thread-id")
            ).rejects.toThrowError("thread tidak ditemukan");
        });
    });

    describe("findById function", () => {
        it("should return thread by id", async () => {
            // Arrange
            const userConfig = { id: "user-dicoding", username: "dicoding" };
            await UsersTableTestHelper.addUser(userConfig);

            const threadConfig = {
                id: "thread-dicoding",
                title: "dicoding",
                body: "Dicoding Indonesia",
                owner: userConfig.id,
                createdAt: new Date(),
            };
            await ThreadsTableTestHelper.add(threadConfig);

            const fakeIdGenerator = () => "dicoding";
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            // Action
            const findByIdThread = await threadRepositoryPostgres.findById(
                threadConfig.id
            );

            // Assert
            const thread = await ThreadsTableTestHelper.findById(
                threadConfig.id
            );
            expect(thread).toHaveLength(1);
            expect(findByIdThread).toStrictEqual({
                id: threadConfig.id,
                title: threadConfig.title,
                body: threadConfig.body,
                date: threadConfig.createdAt,
                username: userConfig.username,
            });
        });

        it("should throw NotFoundError when thread does not exist", async () => {
            // Arrange
            const fakeIdGenerator = () => "dicoding";
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            // Act & Assert
            await expect(
                threadRepositoryPostgres.findById("non-existent-thread-id")
            ).rejects.toThrowError("thread tidak ditemukan");
        });
    });
});
