/* istanbul ignore file */
import request from 'supertest';

const ServerTestHelper = {
  async getAccessTokenWithUser({ server, username = 'wayan' }) {
    await request(server).post('/users').send({
      username, password: 'password', fullname: 'wayan',
    });

    const response = await request(server).post('/authentications').send({
      username, password: 'password',
    });

    return response.body.data.accessToken;
  },
};

export default ServerTestHelper;