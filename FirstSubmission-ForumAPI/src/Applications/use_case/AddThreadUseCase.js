import NewThread from '../../Domains/threads/entities/NewThread.js';

class AddThreadUseCase{
  constructor({ threadRepository }){
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload){
    const { title, body, owner } = useCasePayload;

    const newThread = new NewThread({ title, body });

    return this._threadRepository.addThread({
      ...newThread,
      owner
    });
  }
}

export default AddThreadUseCase;