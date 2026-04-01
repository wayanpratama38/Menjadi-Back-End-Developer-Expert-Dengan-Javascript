import RegisterUser from '../RegisterUser.js';
import {describe, it, expect} from 'vitest';


describe("A RegisterUser entities", ()=> {
    // 1. Registered without needed property
    it('should throw error when payload did not contain needed properties', ()=> {
        // arrange
        const payload = {
            username : "abc",
            password : 'abc',
        }

        // action & assert
        expect(()=> new RegisterUser(payload)).toThrow("REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY");

    })

    // 2. Registered using not expected data type
    it('should throw error when payload contain unexpected properties data type', ()=> {
        // arrange
        const payload ={
            username : "wyn",
            password : 1234,
            fullname : true
        }

        // action & assert
        expect(()=> new RegisterUser(payload)).toThrow("REGISTER_USER.NOT_MEET_DATA_TYPE_SPESIFICATION")
    })
    
    // 3. Username with more than 50 character 
    it("should throw error when username contains more than 50 character",()=> {
        // arrange
        const payload = {
            username : "wynprwynprwynprwynprwynprwynprwynprwynprwynprwynpar",
            password : "papapa",
            fullname : "Wyanparatama"
        }

        // action & assert
        expect(() => new RegisterUser(payload)).toThrow("REGISTER_USER.USERNAME_LIMIT_CHAR")
    })

    // 4. Restricted character inside the username
    it('should throw error when including restricted character in the username', ()=> {
        // arrange
        const payload = {
            username : "wy nprtm",
            password : "wadyw",
            fullname : "yyann"
        }

        // action & assert
        expect(()=> new RegisterUser(payload)).toThrow('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')
    })

    // 5. Using the correct payload
    it('should create RegisterUser object correctly', ()=>{
        // arrange 
        const payload = {
            username : 'wynprtm',
            password : "test123",
            fullname : "Wayan Pratama"
        }

        // action
        const { username, password, fullname } = new RegisterUser(payload);

        // assert
        expect(username).toEqual(payload.username);
        expect(password).toEqual(payload.password);
        expect(fullname).toEqual(payload.fullname);
    })
})
