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

    it('should response 404 when request unregistered route', async () => {
        // Arrange
        const server = await createServer({});
        // Action
        const response = await request(server).get('/unregistered_path')
        // Assert
        expect(response.statusCode).toEqual(404);
    });

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

        it('should response 400 when request payload not contain needed property',async()=>{
            // arrange
            const requestPayload = {
                username : 'wynprtm',
                password : "secret",
            }

            const app = await createServer(container);

            // action
            const response = await request(app).post('/users').send(requestPayload);
            console.log(response.statusCode,"HTTPSERVER")
            // assert
            expect(response.statusCode).toEqual(400);
            expect(response.body.status).toEqual('fail');
            expect(response.body.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
        })

        it('should response 400 when request payload not meet data type specification',async()=>{
            // arrange
            const requestPayload = {
                username : 'wynprtm',
                password : "secret",
                fullname : ['wyan paratam']
            }

            const app = await createServer(container);

            // action
            const response = await request(app).post('/users').send(requestPayload);

            // assert
            expect(response.statusCode).toEqual(400);
            expect(response.body.status).toEqual('fail');
            expect(response.body.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai');
        })

        it('should response 400 when username more than 50 character',async()=>{
            // arrange
            const requestPayload = {
                username : 'wynprwynprwynprwynprwynprwynprwynprwynprwynprwynprr',
                password : "secret",
                fullname : "wayan pratama"
            }

            const app = await createServer(container);

            // action
            const response = await request(app).post('/users').send(requestPayload);

            // assert
            expect(response.statusCode).toEqual(400);
            expect(response.body.status).toEqual('fail');
            expect(response.body.message).toEqual('tidak dapat membuat user baru karena karakter username melebihi batas limit');
            
        })

        it('should response 400 when username contain restricted character',async()=>{
            // arrange
            const requestPayload = {
                username : 'wynprt mawd',
                password : "secret",
                fullname : 'wayan paratama'
            }

            const app = await createServer(container);

            // action
            const response = await request(app).post('/users').send(requestPayload);

            // assert
            expect(response.statusCode).toEqual(400);
            expect(response.body.status).toEqual('fail');
            expect(response.body.message).toEqual('tidak dapat membuat user baru karena username mengandung karakter terlarang');
            
        })

        it('should response 400 when username unavailable',async()=>{
            // arrange
            await UsersTableTestHelper.addUser({username :'wynprtm'})
            const requestPayload = {
                username : 'wynprtm',
                password : "secret",
                fullname : 'wayan pratama'
            }

            const app = await createServer(container);

            // action
            const response = await request(app).post('/users').send(requestPayload);

            // assert
            expect(response.statusCode).toEqual(400);
            expect(response.body.status).toEqual('fail');
            expect(response.body.message).toEqual('username tidak tersedia');
            

        })

        it('should handle internal server error correctly', async()=> {
            const requestPayload = {
                username : 'wynprtm',
                password : "secret",
                fullname : 'wayan pratama'
            }
            const app = await createServer({});
            

            // Action
            const response = await request(app).post('/users').send(requestPayload);
        
            expect(response.statusCode).toEqual(500);
            expect(response.body.status).toEqual('error');
            expect(response.body.message).toEqual('terjadi kegagalan pada server kami');

        })
    })
})