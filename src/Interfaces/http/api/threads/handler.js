const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.createHandler = this.createHandler.bind(this);
  }

  async createHandler(request, h) {
    const { id } = request.auth.credentials;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute({ ...request.payload, owner: id });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;
