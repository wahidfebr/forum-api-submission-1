const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.createHandler,
    options: { auth: 'forum_api_jwt' },
  },
]);

module.exports = routes;
