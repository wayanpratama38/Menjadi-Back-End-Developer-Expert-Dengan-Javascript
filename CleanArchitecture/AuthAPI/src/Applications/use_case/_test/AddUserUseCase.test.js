import { describe, expect,it , vi } from 'vitest';
import RegisterUser from '../../../Domains/users/entities/RegisterUser.js';
import RegisteredUser from '../../../Domains/users/entities/RegisteredUser.js';
import UserRepository from '../../../Domains/users/UserRepository.js';
import PasswordHash from '../../security/PasswordHash.js';
import AddUserUseCase from '../AddUserUseCase.js';


describe('AddUserUseCase',()=>{
    it('Should orchestrating the add user action correctly',async()=>{
        // arrange
        const useCasePayload = {
            username : "wynprtm",
            password : 'secret',
            fullname : "wayan pratama"
        };

        const mockRegisteredUser = new RegisteredUser({
            id : "user-123",
            username : useCasePayload.username,
            fullname : useCasePayload.fullname
        })

        // creating dependecies of use case
        const mockUserRepository = new UserRepository();
        const mockPasswordHash = new PasswordHash();

        // mocking needed function
        mockUserRepository.verifyAvailableUsername = vi.fn()
            .mockImplementation(()=> Promise.resolve());
        mockPasswordHash.hash = vi.fn()
            .mockImplementation(()=>Promise.resolve("encrypted_password"));
        mockUserRepository.addUser = vi.fn()
            .mockImplementation(()=>Promise.resolve(mockRegisteredUser))

        // creating use case instance
        const getUserUseCase = new AddUserUseCase({
            userRepository : mockUserRepository,
            passwordHash : mockPasswordHash
        })

        // action
        const registeredUser = await getUserUseCase.execute(useCasePayload)

        // assert
        expect(registeredUser).toStrictEqual(new RegisteredUser({
            id : 'user-123',
            username : useCasePayload.username,
            fullname : useCasePayload.fullname,
        }))
        expect(mockUserRepository.verifyAvailableUsername).toHaveBeenCalledWith(useCasePayload.username)
        expect(mockPasswordHash.hash).toHaveBeenCalledWith(useCasePayload.password);
        expect(mockUserRepository.addUser).toHaveBeenCalledWith(new RegisterUser({
            username : useCasePayload.username,
            password : 'encrypted_password',
            fullname : useCasePayload.fullname
        }))
    })
})