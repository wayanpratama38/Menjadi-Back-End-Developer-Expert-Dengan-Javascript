import request from 'supertest';
import pool from '../../database/postgres/pool.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import container from '../../container.js';
import createServer from '../createServer.js';
import { afterAll, afterEach, describe, it , expect } from 'vitest';


describe('HTTP Server', ()=>{
    afterAll(async ()=>{
        await pool.end();
    })

    afterEach(async ()=>{
        await UsersTableTestHelper.cleanTable();
    })

    describe('when POST /users', ()=> {
        it('should response 201 and persisted user', async()=>{
            // arrange

            const requestPayload = {
                username : 'wynprtm',
                password : "secret",
                fullname : "wayan pratama"
            }

            const app = await createServer(container);

            // action
            const response = await request(app).post('/users').send(requestPayload);

            // assert
            expect(response.statusCode).toEqual(201);
            expect(response.body.status).toEqual('success');
            expect(response.body.data.addedUser).toBeDefined()
        })
    })
})