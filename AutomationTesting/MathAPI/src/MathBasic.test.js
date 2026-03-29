import { describe, expect, it } from 'vitest';
import MathBasic from './MathBasic.js';

describe('A MathBasic', ()=> {
    it('should contains add, subtract, multiply, and divide function', ()=>{
        expect(MathBasic).toHaveProperty('add');
        expect(MathBasic).toHaveProperty('subtract');
        expect(MathBasic).toHaveProperty('multiply');
        expect(MathBasic).toHaveProperty('divide');
        expect(MathBasic.add).toBeInstanceOf(Function);
        expect(MathBasic.subtract).toBeInstanceOf(Function);
        expect(MathBasic.multiply).toBeInstanceOf(Function);
        expect(MathBasic.divide).toBeInstanceOf(Function);
    })
})

describe('A add function',() => {
    it('should throw error when not given 2 paramaters', () => {
        expect(()=> MathBasic.add()).toThrow();
        expect(()=> MathBasic.add(1)).toThrow();
        expect(()=> MathBasic.add(1,2,3)).toThrow();
        expect(()=> MathBasic.add(1,2,3,4)).toThrow();


    });

    it('should throw error when given non-number paramaters', () => {
        expect(()=> MathBasic.add('1','2')).toThrow();
        expect(()=> MathBasic.add(true,{})).toThrow();
        expect(()=> MathBasic.add(null,false)).toThrow();

    })

    it('should return a + b when given two number parameters', () => {
      expect(MathBasic.add(2, 2)).toEqual(4);
      expect(MathBasic.add(16, 8)).toEqual(24);
      expect(MathBasic.add(3, 7)).toEqual(10);
    });
})


describe('A subtract function', () => {
    it('should throw error when not given 2 paramaters', () => {
        expect(()=> MathBasic.subtract()).toThrow();
        expect(()=> MathBasic.subtract(1)).toThrow();
        expect(()=> MathBasic.subtract(1,2,3)).toThrow();
        expect(()=> MathBasic.subtract(1,2,3,4)).toThrow();
    })

    it('should throw error when given non-number parameters', () => {
        expect(() => MathBasic.subtract('1','1')).toThrow();
        expect(() => MathBasic.subtract(true,{})).toThrow();
        expect(() => MathBasic.subtract(false,null)).toThrow();
    })

    it('should return a-b when given two number parameters', () => {
        expect(MathBasic.subtract(1,2)).toEqual(-1);
        expect(MathBasic.subtract(2,2)).toEqual(0);
        expect(MathBasic.subtract(3,2)).toEqual(1);
    })
})


describe('A multiply function', () => {
    it('should throw error when not given 2 paramaters', () => {
        expect(()=> MathBasic.multiply()).toThrow();
        expect(()=> MathBasic.multiply(1)).toThrow();
        expect(()=> MathBasic.multiply(1,2,3)).toThrow();
        expect(()=> MathBasic.multiply(1,2,3,4)).toThrow();
    })

    it('should throw error when given non-number parameters', () => {
        expect(() => MathBasic.multiply('1','1')).toThrow();
        expect(() => MathBasic.multiply(true,{})).toThrow();
        expect(() => MathBasic.multiply(false,null)).toThrow();
    })

    it('should return a*b when given two number parameters', () => {
        expect(MathBasic.multiply(1,2)).toEqual(2);
        expect(MathBasic.multiply(2,2)).toEqual(4);
        expect(MathBasic.multiply(3,2)).toEqual(6);
    })
})


describe('A divide function', () => {
    it('should throw error when not given 2 paramaters', () => {
        expect(()=> MathBasic.divide()).toThrow();
        expect(()=> MathBasic.divide(1)).toThrow();
        expect(()=> MathBasic.divide(1,2,3)).toThrow();
        expect(()=> MathBasic.divide(1,2,3,4)).toThrow();
    })

    it('should throw error when given non-number parameters', () => {
        expect(() => MathBasic.divide('1','1')).toThrow();
        expect(() => MathBasic.divide(true,{})).toThrow();
        expect(() => MathBasic.divide(false,null)).toThrow();
    })

    it('should return a/b when given two number parameters', () => {
        expect(MathBasic.divide(1,2)).toEqual(0.5);
        expect(MathBasic.divide(2,2)).toEqual(1);
        expect(MathBasic.divide(3,2)).toEqual(1.5);
    })
})