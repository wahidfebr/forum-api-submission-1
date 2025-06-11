const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const ThreadDetailUseCase = require('../../../../Applications/use_case/ThreadDetailUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.createHandler = this.createHandler.bind(this);
    this.findById = this.findById.bind(this);
  }

  async createHandler(request, h) {
    const { id } = request.auth.credentials;
    const addThreadUseCase = this._container.getInstance(
      AddThreadUseCase.name,
    );
    const addedThread = await addThreadUseCase.execute({
      ...request.payload,
      owner: id,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async findById(request, h) {
    const threadDetailUseCase = this._container.getInstance(
      ThreadDetailUseCase.name,
    );
    const thread = await threadDetailUseCase.execute({
      ...request.params,
    });

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    return response;
  }
}

module.exports = ThreadsHandler;
