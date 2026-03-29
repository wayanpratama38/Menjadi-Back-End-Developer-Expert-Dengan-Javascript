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