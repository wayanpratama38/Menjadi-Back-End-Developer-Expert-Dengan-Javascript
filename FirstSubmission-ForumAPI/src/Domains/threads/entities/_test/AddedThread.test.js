import { describe, expect } from 'vitest';
import AddedThread from '../AddedThread.js';

describe('a AddedThread entities', ()=> {
  it('should throw error when payload did not contain needed property', ()=> {
    const payload = {
      id : 'thread-1',
      title : 'title',
    };

    expect(()=> new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', ()=> {
    const payload = {
      id : 123,
      title : true,
      owner : []
    };

    expect(()=> new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedThread object correctly', ()=> {
    const payload = {
      id : 'thread-123',
      title : 'title',
      owner : 'owner-123'
    };

    const addedThread = new AddedThread(payload);

    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});