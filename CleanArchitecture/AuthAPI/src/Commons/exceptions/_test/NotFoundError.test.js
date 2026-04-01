import NotFoundError from '../NotFoundError.js';
import { describe, it, expect } from 'vitest';

describe("NotFoundError", ()=> {
    it("Should create NotFoundError correctly", ()=> {
        const notFoundError = new NotFoundError('not found');

        expect(notFoundError.statusCode).toEqual(404);
        expect(notFoundError.message).toEqual("not found");
        expect(notFoundError.name).toEqual("NotFoundError");
    })
})

