import { describe, expect, vi } from 'vitest';
import AddedThread from '../../../Domains/threads/entities/AddedThread.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository';
import AddThreadUseCase from '../AddThreadUseCase';



describe('AddThreadUseCase', ()=> {
  it('should orchestrating the add thread action correctly', async ()=> {
    const useCasePayload = {
      title : 'title',
      body : 'body',
    };

    const ownerId = 'user-123';

    const expectedAddedThread = new AddedThread({
      id : 'thread-123',
      title : useCasePayload.title,
      owner  : ownerId,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = vi.fn()
      .mockImplementation(()=> Promise.resolve(expectedAddedThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository : mockThreadRepository,
    });

    const addThread = await addThreadUseCase.execute({
      ...useCasePayload,
      owner : ownerId,
    });

    expect(addThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith({
      title : useCasePayload.title,
      body : useCasePayload.body,
      owner : ownerId
    });
  });
});