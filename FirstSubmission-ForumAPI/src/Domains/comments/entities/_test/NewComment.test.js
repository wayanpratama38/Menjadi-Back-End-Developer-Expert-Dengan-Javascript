import NewComment from '../NewComment.js';


describe('NewComment entities', ()=>{
  it('should throw error when payload did not contain needed property', ()=>{
    const payload = {
      username : 'awd'
    };

    expect(()=> new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', ()=> {
    const payload = {
      content : true
    };

    expect(()=> new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newComment object correctly', ()=> {
    const payload = {
      content : 'comment'
    };

    const newComment = new NewComment(payload);

    expect(newComment.content).toEqual(payload.content);
  });
});

