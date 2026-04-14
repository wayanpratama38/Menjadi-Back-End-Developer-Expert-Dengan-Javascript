import NewThread from '../NewThread.js';
import { describe, it, expect } from 'vitest';


describe('a NewThread entities', ()=> {
  it('should throw error when payload did not contain needed property', ()=> {
    const payload = {
      title : 'title',
    };

    expect(()=> new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', ()=> {
    const payload = {
      title : [],
      body : true
    };

    expect(()=> new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newthread object correctly', ()=> {
    const payload = {
      title : 'title',
      body : 'body',
    };

    const newThread = new NewThread(payload);

    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
  });
});
