const pool = require("../../database/postgres/pool");
const container = require("../../container");
const createServer = require("../createServer");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const ServerTestHelper = require("../../../../tests/ServerTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");

describe("/threads endpoint", () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
    });

    describe("when POST /threads", () => {
        it("should response 201 and persisted thread", async () => {
            // Arrange
            const threadPayload = {
                title: "dicoding",
                body: "Dicoding Indonesia",
            };

            const server = await createServer(container);
            const { accessToken, userId } =
                await ServerTestHelper.generateAccessToken(server);

            // Action
            const response = await server.inject({
                method: "POST",
                url: "/threads",
                payload: threadPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual("success");
            expect(responseJson.data.addedThread).toBeDefined();
            expect(responseJson.data.addedThread.title).toEqual(
                threadPayload.title
            );
            expect(responseJson.data.addedThread.owner).toEqual(userId);
        });

        it("should response 400 when request payload not contain needed property", async () => {
            // Arrange
            const threadPayload = {
                title: "Example Title",
            };

            const server = await createServer(container);
            const { accessToken } = await ServerTestHelper.generateAccessToken(
                server
            );

            // Action
            const response = await server.inject({
                method: "POST",
                url: "/threads",
                payload: threadPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual("fail");
            expect(responseJson.message).toEqual(
                "tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada"
            );
        });

        it("should response 400 when request payload not meet data type specification", async () => {
            // Arrange
            const threadPayload = {
                title: true,
                body: 123,
            };

            const server = await createServer(container);
            const { accessToken } = await ServerTestHelper.generateAccessToken(
                server
            );

            // Action
            const response = await server.inject({
                method: "POST",
                url: "/threads",
                payload: threadPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual("fail");
            expect(responseJson.message).toEqual(
                "tidak dapat membuat thread baru karena tipe data tidak sesuai"
            );
        });

        it("should response 401 status code when add thread without authentication", async () => {
            // Arrange
            const threadPayload = {
                title: "Example Title",
                body: "Example Body",
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: "POST",
                url: "/threads",
                payload: threadPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.message).toEqual("Missing authentication");
        });
    });

    describe("when GET /threads/{threadId}", () => {
        it("should response 200 with the detailed thread", async () => {
            // Arrange
            const server = await createServer(container);
            const { userId } = await ServerTestHelper.generateAccessToken(
                server
            );

            const threadConfig = {
                id: "thread-dicoding",
                title: "dicoding",
                body: "Dicoding Indonesia",
                owner: userId,
            };
            const commentConfig = {
                id: "comment-dicoding",
                threadId: threadConfig.id,
                owner: userId,
            };

            await ThreadsTableTestHelper.add(threadConfig);
            await CommentsTableTestHelper.add(commentConfig);

            // Action
            const response = await server.inject({
                method: "GET",
                url: `/threads/${threadConfig.id}`,
            });

            // Assert

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual("success");
            expect(responseJson.data.thread).toBeDefined();
            expect(responseJson.data.thread.title).toEqual(threadConfig.title);
            const { comments } = responseJson.data.thread;
            expect(comments).toBeDefined();
            expect(comments[0].id).toEqual(commentConfig.id);
        });

        it("should response 404 when thread not exist", async () => {
            // Arrange
            const threadId = "thread-dicoding";
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: "GET",
                url: `/threads/${threadId}`,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toBeDefined();
            expect(responseJson.message).toBeDefined();
        });
    });
});
