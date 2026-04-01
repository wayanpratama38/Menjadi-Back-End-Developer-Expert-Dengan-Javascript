import UserRepository from '../UserRepository.js'
import {describe, it, expect} from 'vitest';

describe('UserRepository interface', () => {
    it('should throw error when invoke abstract behaviour', async()=> {
        // arrange
        const userRepository = new UserRepository();

        // action & assert
        await expect(userRepository.addUser({})).rejects.toThrow("USER_REPOSITORY.METHOD_NOT_IMPLEMENTED")
        await expect(userRepository.verifyAvailableUsername('')).rejects.toThrow("USER_REPOSITORY.METHOD_NOT_IMPLEMENTED")
    })
})