import PasswordHash from '../PasswordHash.js';
import {describe, it, expect} from 'vitest';

describe("PasswordHash interface", ()=>{
    it('should throw error when invoke abstract behaviour', async() => {
        // arrange
        const passwordHash = new PasswordHash();

        // action & assert
        await expect(passwordHash.hash('dummy_password')).rejects.toThrow("PASSWORD_HASH.METHOD_NOT_IMPLEMENTED")
    })
})