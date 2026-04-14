import { expect } from 'vitest';
import AddedComment from '../AddedComment.js';


describe('AddedComment entities', ()=> {
  it('should return error when payload did not contain needed property', ()=> {
    const payload = {
      id : 'comment-123',
      content : 'comment',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should return error when payload did not meet the data type specification', ()=> {
    const payload = {
      id : true,
      content : [],
      owner : {},
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedComment object correctly', ()=> {
    const payload = {
      id : 'comment-123',
      content : 'comment',
      owner : 'user-123',
    };

    const addedComment = new AddedComment(payload);

    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});