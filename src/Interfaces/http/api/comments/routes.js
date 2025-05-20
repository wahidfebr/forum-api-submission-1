const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.createHandler,
    options: { auth: 'forum_api_jwt' },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteHandler,
    options: { auth: 'forum_api_jwt' },
  },
]);

module.exports = routes;
