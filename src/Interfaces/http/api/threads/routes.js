const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.createHandler,
    options: { auth: 'forum_api_jwt' },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.findById,
  },
]);

module.exports = routes;
