import InvariantError from "../InvariantError.js";
import {describe, expect, it, } from 'vitest';

describe('InvariantError', ()=> {
    it("Should create an error correctly", ()=> {
        const invariantError = new InvariantError("an error occurs");

        expect(invariantError.statusCode).toEqual(400);
        expect(invariantError.message).toEqual('an error occurs');
        expect(invariantError.name).toEqual("InvariantError");
    })
})