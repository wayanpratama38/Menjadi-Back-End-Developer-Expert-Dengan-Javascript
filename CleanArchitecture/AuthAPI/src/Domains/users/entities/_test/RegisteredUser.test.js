import RegisteredUser from '../RegisteredUser.js';
import { describe,it, expect } from 'vitest';

describe("a RegisteredUser entities", ()=> {
    it('should throw error when payload did not contain needed property', ()=>{
        // arrange
        const payload = {
            username : "wyn",
            fullname : "wynprtm"
        }

        // action & assert
        expect(()=> new RegisteredUser(payload)).toThrow("REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY")
    })

    it('should throw errro when payload did not meet data type spesification', ()=> {
        // arrange
        const payload = {
            id : 123,
            username : 'awd',
            fullname : true
        }

        // action & assert
        expect(()=> new RegisteredUser(payload)).toThrow("REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION")
    })

    it('should create registereduser object correctly', ()=> {
        // arrange
        const payload = {
            id : "user-123",
            username : 'wynprmt',
            fullname : "wayan pratama"
        }

        // action
        const { id, username, fullname} = new RegisteredUser(payload)

        // assert
        expect(id).toEqual(payload.id)
        expect(username).toEqual(payload.username)
        expect(fullname).toEqual(payload.fullname)
    })
})