/* istanbul ignore file */

import {createContainer} from 'instances-container';


// External source
import {nanoid} from 'nanoid';
import bcrypt from 'bcrypt';
import pool from './database/postgres/pool.js';

// Service
import UserRepository from './Domains/users/UserRepository.js';
import UserRepositoryPostgres from './repository/UserRepositoryPostgres.js';
import BcryptPasswordHash from './security/BcryptPasswordHash.js';


// Use case
import AddUserUseCase from '../Applications/use_case/AddUserUseCase.js';
import PasswordHash from '../Applications/security/PasswordHash.js';

// create container
const container = createContainer();

container.register([
    // Service UserRepositoryPostgres
    {
        key : UserRepository.name,
        Class : UserRepositoryPostgres,
        parameter : {
            dependencies : [
                {
                    concrete : pool
                },
                {
                    concrete : nanoid
                }
            ]
        }
    },
    // Service BcryptPasswordHash
    {
        key : PasswordHash.name,
        Class : BcryptPasswordHash,
        parameter : {
            dependencies : [
                {
                    concrete : bcrypt
                }
            ]
        }
    }
])


container.register([
    {
        key : AddUserUseCase.name,
        Class : AddUserUseCase,
        parameter : {
            injectType : 'destructuring',
            dependencies : [
                {
                    name : 'userRepository',
                    internal : UserRepository.name
                },
                {
                    name : 'passwordHash',
                    internal : PasswordHash.name
                }
            ]
        }
    }
])

export default container;