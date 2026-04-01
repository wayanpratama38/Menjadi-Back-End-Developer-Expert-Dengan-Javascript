import AuthenticationError from '../AuthenticationError';
import {describe, expect, it, } from 'vitest';

describe("AuthenticationError", ()=> {
    it("Should create authentication error correctly", ()=> {
        const authenticationError =  new AuthenticationError("authentication error");

        expect(authenticationError.statusCode).toEqual(401);
        expect(authenticationError.message).toEqual("authentication error");
        expect(authenticationError.name).toEqual("AuthenticationError");
    })
})