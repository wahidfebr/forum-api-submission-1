/* istanbul ignore file */
const ServerTestHelper = {
  async generateAccessToken(server) {
    const userPayload = {
      username: 'userdicoding',
      password: 'password',
      fullname: 'User Dicoding',
    };

    const responseAddUser = await server.inject({
      method: 'POST',
      url: '/users',
      payload: userPayload,
    });

    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: userPayload.username,
        password: userPayload.password,
      },
    });

    return {
      accessToken: JSON.parse(responseAuth.payload).data.accessToken,
      userId: JSON.parse(responseAddUser.payload).data.addedUser.id,
    };
  },
};

module.exports = ServerTestHelper;
