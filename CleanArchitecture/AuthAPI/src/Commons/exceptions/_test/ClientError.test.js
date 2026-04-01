import ClientError from "../ClientError";
import {describe, expect, it, } from 'vitest';

describe('ClientError', () => {
    it('Should throw error when directly use it ', ()=> {
        expect(() => new ClientError('')).toThrow("Cannot instantiate abstract class")
    })
})
