import request from 'supertest';
import createServer from './CreateServer.js';
import MathBasic from './MathBasic.js';
import { describe,it,expect,vi } from 'vitest';

describe('A HTTP Server', () => {
  describe('when GET /add', () => {
    it('should respond with a status code of 200 and the payload value is addition result of a and b correctly', async () => {
      // Arrange
      const a = 10;
      const b = 20;
      const spyAdd = vi.spyOn(MathBasic, 'add');
      const app = createServer({ mathBasic: MathBasic });
      // Action
      const response = await request(app).get(`/add/${a}/${b}`);
      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.value).toEqual(30); // a + b
      expect(spyAdd).toHaveBeenCalledWith(a, b);
    });
  });

  describe('when GET /subtract', () => {
    it('should respond with a status code of 200 and the payload value is subtraction result of a and b correctly', async () => {
      // Arrange
      const a = 12;
      const b = 8;
      const spySubtract = vi.spyOn(MathBasic, 'subtract');
      const app = createServer({ mathBasic: MathBasic });
      // Action
      const response = await request(app).get(`/subtract/${a}/${b}`);
      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.value).toEqual(4); // a - b
      expect(spySubtract).toHaveBeenCalledWith(a, b);
    });
  });

  describe('when GET /multiply', () => {
    it('should respond with a status code of 200 and the payload value is multiplyion result of a and b correctly', async () => {
      // Arrange
      const a = 4;
      const b = 8;
      const spymultiply = vi.spyOn(MathBasic, 'multiply');
      const app = createServer({ mathBasic: MathBasic });
      // Action
      const response = await request(app).get(`/multiply/${a}/${b}`);
      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.value).toEqual(32); // a * b
      expect(spymultiply).toHaveBeenCalledWith(a, b);
    });
  });

  describe('when GET /divide', () => {
    it('should respond with a status code of 200 and the payload value is divideion result of a and b correctly', async () => {
      // Arrange
      const a = 8;
      const b = 4;
      const spydivide = vi.spyOn(MathBasic, 'divide');
      const app = createServer({ mathBasic: MathBasic });
      // Action
      const response = await request(app).get(`/divide/${a}/${b}`);
      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.value).toEqual(2); // a / b
      expect(spydivide).toHaveBeenCalledWith(a, b);
    });
  });

  describe('when GET /rectangle/perimeter', () => {
    it('should respond with a status code of 200 and the payload value is rectangle perimeter result of a and b correctly', async () => {
      // Arrange
      const length = 8;
      const width = 4;
      const spyAdd = vi.spyOn(MathBasic, 'add');
      const spyMultiply = vi.spyOn(MathBasic, 'multiply')
      const app = createServer({ mathBasic: MathBasic });
      // Action
      const response = await request(app).get(`/rectangle/perimeter/${length}/${width}`);
      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.value).toEqual(24); // 2 * (a + b)
      expect(spyAdd).toHaveBeenCalledWith(length,width);
      expect(spyMultiply).toHaveBeenCalledWith(2,12);
    });
  });

  describe('when GET /triangle/perimeter', () => {
    it('should respond with a status code of 200 and the payload value is triangle perimeter result of a and b correctly', async () => {
      // Arrange
      const a = 8;
      const b = 4;
      const c = 2;
      const spyAdd = vi.spyOn(MathBasic, 'add');
      const app = createServer({ mathBasic: MathBasic });
      // Action
      const response = await request(app).get(`/triangle/perimeter/${a}/${b}/${c}`);
      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.value).toEqual(14); //  a + b + c
      expect(spyAdd).toHaveBeenCalledWith(a,b);
      expect(spyAdd).toHaveBeenCalledWith(12,c);
    });
  });

  describe('when GET /triangle/area', () => {
    it('should respond with a status code of 200 and the payload value is triangle area result of a and b correctly', async () => {
      // Arrange
      const base = 8;
      const height = 4;
      const spyAdd = vi.spyOn(MathBasic, 'add');
      const spyMultiply = vi.spyOn(MathBasic, 'multiply');
      const app = createServer({ mathBasic: MathBasic });
      // Action
      const response = await request(app).get(`/triangle/area/${base}/${height}`);
      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.value).toEqual(6); //  0.5 * (base + height)
      expect(spyAdd).toHaveBeenCalledWith(base,height);
      expect(spyMultiply).toHaveBeenCalledWith(0.5,12);
    });
  });

  describe('when GET /rectangle/area', () => {
    it('should respond with a status code of 200 and the payload value is rectangle area result of a and b correctly', async () => {
      // Arrange
      const length = 8;
      const width = 4;
      const spyMultiply = vi.spyOn(MathBasic, 'multiply');
      const app = createServer({ mathBasic: MathBasic });
      // Action
      const response = await request(app).get(`/rectangle/area/${length}/${width}`);
      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.value).toEqual(32); //  length * width
      expect(spyMultiply).toHaveBeenCalledWith(length,width);
    });
  });
});