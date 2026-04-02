import {describe, it, expect, vi} from 'vitest';
import bcrypt from 'bcrypt';
import BcryptPasswordHash from '../BcryptPasswordHash.js';

describe('BcryptPasswordHash',()=>{
    describe('hash function',()=>{
        it('should encrypt password correctly', async ()=>{
            // arrange
            const spyHash = vi.spyOn(bcrypt,'hash');
            const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

            // action
            const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

            // assert
            expect(typeof encryptedPassword).toEqual('string');
            expect(encryptedPassword).not.toEqual('plain_password');
            expect(spyHash).toHaveBeenCalledWith('plain_password',10);
        })
    })
})