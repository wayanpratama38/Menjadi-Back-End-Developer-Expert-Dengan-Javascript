import request from 'supertest';
import pool from '../../database/postgres/pool.js';
import ReplyTableTestHelper from '../../../../tests/ReplyTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import ServerTestHelper from '../../../../tests/ServerTestHelper.js';
import container from '../../container.js';
import createServer from '../createServer.js';
import { describe } from 'vitest';

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ReplyTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', ()=> {
    it('should response 201 and added comment', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessTokenWithUser({ server });
      const threadId = 'thread-123';
      const userId = 'user-123';

      await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      const requestPayload = { content: 'sebuah komentar' };

      const response = await request(server)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(requestPayload);


      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedComment).toBeDefined();
      expect(response.body.data.addedComment.content).toEqual(requestPayload.content);
    });

    it('should response 400 when payload bad', async () => {

      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessTokenWithUser({ server });
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-123' });


      const response = await request(server)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 404 when thread not found', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessTokenWithUser({ server });

      const response = await request(server)
        .post('/threads/thread-999/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'isi komentar' });

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 401 when unauthenticated', async () => {
      const server = await createServer(container);

      const response = await request(server)
        .post('/threads/thread-123/comments')
        .send({ content: 'isi komentar' });

      expect(response.status).toEqual(401);
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', ()=> {
    it('should response 200 and delete comment correctly', async () => {
      const server = await createServer(container);
      const username = 'wayan';
      const accessToken = await ServerTestHelper.getAccessTokenWithUser({ server, username });

      const users = await UsersTableTestHelper.findUserByUsername(username);
      const userId = users[0].id;

      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      const response = await request(server)
        .delete(`/threads/${threadId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');

      const comments = await CommentsTableTestHelper.findCommentsById(commentId);
      expect(comments[0].is_delete).toEqual(true);
    });

    it('should response 403 when user is not the owner of comment', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessTokenWithUser({ server, username: 'oranglain' });

      const otherUserId = 'user-456';
      await UsersTableTestHelper.addUser({ id: otherUserId, username: 'wayan' });
      await ThreadsTableTestHelper.addThread({ id: 't1', owner: otherUserId });
      await CommentsTableTestHelper.addComment({ id: 'c1', threadId: 't1', owner: otherUserId });

      const response = await request(server)
        .delete('/threads/t1/comments/c1')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(403);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 404 when thread or comment not found', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessTokenWithUser({ server });

      const response = await request(server)
        .delete('/threads/thread-999/comments/comment-999')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and added reply', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessTokenWithUser({ server });

      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: userId, username: 'coba' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      const response = await request(server)
        .post(`/threads/${threadId}/comments/${commentId}/replies`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'isi balasan' });

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedReply).toBeDefined();
    });

    it('should response 400 when payload bad', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessTokenWithUser({ server });
      const requestPayload = {};

      const response = await request(server)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(requestPayload);

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 404 if comment or thread not found', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessTokenWithUser({ server });

      const response = await request(server)
        .post('/threads/thread-999/comments/comment-999/replies')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'content' });

      expect(response.status).toEqual(404);
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and delete reply', async () => {
      const server = await createServer(container);
      const username = 'wayan';
      const accessToken = await ServerTestHelper.getAccessTokenWithUser({ server, username });

      const users = await UsersTableTestHelper.findUserByUsername(username);
      const owner = users[0].id;

      await ThreadsTableTestHelper.addThread({ id: 't1', owner });
      await CommentsTableTestHelper.addComment({ id: 'c1', threadId: 't1', owner });
      await ReplyTableTestHelper.addReply({ id: 'r1', commentId: 'c1', owner });

      const response = await request(server)
        .delete('/threads/t1/comments/c1/replies/r1')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });

    it('should response 403 when user is not the owner', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessTokenWithUser({ server, username: 'not_owner' });

      const userId = 'user-123';
      await UsersTableTestHelper.addUser({ id: userId, username: 'owner' });

      await ThreadsTableTestHelper.addThread({ id: 't1', owner: userId });
      await CommentsTableTestHelper.addComment({ id: 'c1', threadId: 't1', owner: userId });
      await ReplyTableTestHelper.addReply({ id: 'r1', commentId: 'c1', owner: userId });

      const response = await request(server)
        .delete('/threads/t1/comments/c1/replies/r1')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(403);
    });

    it('should response 404 if reply to be deleted is not found', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessTokenWithUser({ server });

      const response = await request(server)
        .delete('/threads/thread-123/comments/comment-123/replies/reply-999')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined();
    });
  });
});