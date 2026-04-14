import { describe, expect } from 'vitest';
import ThreadRepository from '../ThreadRepository.js';


describe('ThreadRepository interface', ()=> {
  it('should throw error when invoke abstract method', async ()=> {
    const threadRepository = new ThreadRepository();

    await expect(threadRepository.addThread({})).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});