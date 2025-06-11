/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
    async add({
        id = "comment-dicoding",
        threadId = "thread-dicoding",
        owner = "user-dicoding",
        parentId = null,
        content = "Dicoding Indonesia",
        createdAt = new Date(),
    }) {
        const query = {
            text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $6)",
            values: [id, threadId, owner, parentId, content, createdAt],
        };

        await pool.query(query);
    },

    async findById(id) {
        const query = {
            text: "SELECT * FROM comments WHERE id = $1",
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query("DELETE FROM comments WHERE 1=1");
    },
};

module.exports = CommentsTableTestHelper;
