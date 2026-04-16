import request from 'supertest';
import pool from '../../database/postgres/pool.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js';
import ServerTestHelper from '../../../../tests/ServerTestHelper.js';
import container from '../../container.js';
import createServer from '../createServer.js';
import { describe } from 'vitest';

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  it('should response 401 when access token is invalid', async () => {
    const server = await createServer(container);

    const response = await request(server)
      .post('/threads')
      .set('Authorization', 'Bearer token_rusak')
      .send({ title: 'abc', body: 'def' });

    expect(response.status).toEqual(401);
    expect(response.body.message).toEqual('Invalid token');
  });

  describe('when POST /threads', () => {
    it('should response 201 and added thread', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessTokenWithUser({ server });
      const requestPayload = { title: 'sebuah thread', body: 'isi thread' };

      const response = await request(server)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(requestPayload);

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedThread).toBeDefined();
    });

    it('should response 400 when payload bad', async () => {
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessTokenWithUser({ server });
      const requestPayload = { title: 'sebuah thread' };

      const response = await request(server)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(requestPayload);

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 401 when no access token', async () => {
      const server = await createServer(container);
      const response = await request(server).post('/threads').send({ title: 'a', body: 'b' });

      expect(response.status).toEqual(401);
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return thread detail', async () => {
      const server = await createServer(container);
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-123' });

      const response = await request(server).get(`/threads/${threadId}`);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.thread).toBeDefined();
    });

    it('should response 404 when thread not found', async () => {
      const server = await createServer(container);
      const response = await request(server).get('/threads/thread-999');

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });
  });
});