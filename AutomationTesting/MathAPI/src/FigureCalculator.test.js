import { describe, expect, it, vi } from 'vitest';
import FigureCalculator from './FigureCalculator.js';
import MathBasic from './MathBasic.js';


describe('A figure calculator', () => {
    it('should contain all the functionalitty', () => {
        const figureCalculator = new FigureCalculator({});
 
        expect(figureCalculator).toHaveProperty('calculateRectanglePerimeter');
        expect(figureCalculator).toHaveProperty('calculateRectangleArea');
        expect(figureCalculator).toHaveProperty('calculateTrianglePerimeter');
        expect(figureCalculator).toHaveProperty('calculateTriangleArea');
        expect(figureCalculator.calculateRectanglePerimeter).toBeInstanceOf(Function);
        expect(figureCalculator.calculateRectangleArea).toBeInstanceOf(Function);
        expect(figureCalculator.calculateTrianglePerimeter).toBeInstanceOf(Function);
        expect(figureCalculator.calculateTriangleArea).toBeInstanceOf(Function);
    })
})


describe('calculateRectanglePerimeter method', ()=> {
    it('should throw error when not given 2 paramaters', () => {
        const figureCalculator = new FigureCalculator({});


        expect(()=> figureCalculator.calculateRectanglePerimeter()).toThrow();
        expect(()=> figureCalculator.calculateRectanglePerimeter(1)).toThrow();
        expect(()=> figureCalculator.calculateRectanglePerimeter(1,2,3)).toThrow();
        expect(()=> figureCalculator.calculateRectanglePerimeter(1,2,3,4)).toThrow();


    });

    it('should throw error when given non-number paramaters', () => {
        const figureCalculator = new FigureCalculator({});

        expect(()=> figureCalculator.calculateRectanglePerimeter('1','2')).toThrow();
        expect(()=> figureCalculator.calculateRectanglePerimeter(true,{})).toThrow();
        expect(()=> figureCalculator.calculateRectanglePerimeter(null,false)).toThrow();
    })

    it('should return correct value based on rectangle perimeter formula',()=>{
        // Arrange
        const length = 20;
        const width = 10;
        const spyAdd = vi.spyOn(MathBasic,'add');
        const spyMultiply = vi.spyOn(MathBasic, "multiply");
        const figureCalculator = new FigureCalculator(MathBasic);

        // Action
        const result = figureCalculator.calculateRectanglePerimeter(length,width);

        // Assert
        expect(result).toEqual(60);
        expect(spyAdd).toHaveBeenCalledWith(length,width);
        expect(spyMultiply).toHaveBeenCalledWith(2,30);
    })
})

describe('calculateRectangleArea method', ()=> {
    it('should throw error when not given 2 paramaters', () => {
        const figureCalculator = new FigureCalculator({});


        expect(()=> figureCalculator.calculateRectangleArea()).toThrow();
        expect(()=> figureCalculator.calculateRectangleArea(1)).toThrow();
        expect(()=> figureCalculator.calculateRectangleArea(1,2,3)).toThrow();
        expect(()=> figureCalculator.calculateRectangleArea(1,2,3,4)).toThrow();


    });

    it('should throw error when given non-number paramaters', () => {
        const figureCalculator = new FigureCalculator({});

        expect(()=> figureCalculator.calculateRectangleArea('1','2')).toThrow();
        expect(()=> figureCalculator.calculateRectangleArea(true,{})).toThrow();
        expect(()=> figureCalculator.calculateRectangleArea(null,false)).toThrow();
    })

    it('should return correct value based on rectangle area formula',()=>{
        // Arrange
        const length = 5;
        const width = 2;
        const spyMultiply = vi.spyOn(MathBasic, "multiply");
        const figureCalculator = new FigureCalculator(MathBasic);

        // Action
        const result = figureCalculator.calculateRectangleArea(length,width);

        // Assert
        expect(result).toEqual(10);
        expect(spyMultiply).toHaveBeenCalledWith(length,width);
    })
})

describe('calculateTrianglePerimeter method', ()=> {
    it('should throw error when not given 3 paramaters', () => {
        const figureCalculator = new FigureCalculator({});


        expect(()=> figureCalculator.calculateTrianglePerimeter()).toThrow();
        expect(()=> figureCalculator.calculateTrianglePerimeter(1)).toThrow();
        expect(()=> figureCalculator.calculateTrianglePerimeter(1,2)).toThrow();
        expect(()=> figureCalculator.calculateTrianglePerimeter(1,2,3,4)).toThrow();
    });

    it('should throw error when given non-number paramaters', () => {
        const figureCalculator = new FigureCalculator({});

        expect(()=> figureCalculator.calculateTrianglePerimeter('1','2','2')).toThrow();
        expect(()=> figureCalculator.calculateTrianglePerimeter(true,{},false)).toThrow();
        expect(()=> figureCalculator.calculateTrianglePerimeter(null,false,{})).toThrow();
    })

    it('should return correct value based on rectangle area formula',()=>{
        // Arrange
        const a = 5;
        const b = 2;
        const c = 3;
        const spyAdd = vi.spyOn(MathBasic, "add")
        const figureCalculator = new FigureCalculator(MathBasic);

        // Action
        const result = figureCalculator.calculateTrianglePerimeter(a,b,c);

        // Assert
        expect(result).toEqual(10);
        expect(spyAdd).toHaveBeenCalledWith(a,b);
        expect(spyAdd).toHaveBeenCalledWith(7,c)
    })
})


describe('calculateTriangleArea method', ()=> {
    it('should throw error when not given 2 paramaters', () => {
        const figureCalculator = new FigureCalculator({});


        expect(()=> figureCalculator.calculateTriangleArea()).toThrow();
        expect(()=> figureCalculator.calculateTriangleArea(1)).toThrow();
        expect(()=> figureCalculator.calculateTriangleArea(1,2,3)).toThrow();
        expect(()=> figureCalculator.calculateTriangleArea(1,2,3,4)).toThrow();


    });

    it('should throw error when given non-number paramaters', () => {
        const figureCalculator = new FigureCalculator({});

        expect(()=> figureCalculator.calculateTriangleArea('1','2')).toThrow();
        expect(()=> figureCalculator.calculateTriangleArea(true,{})).toThrow();
        expect(()=> figureCalculator.calculateTriangleArea(null,false)).toThrow();
    })

    it('should return correct value based on rectangle area formula',()=>{
        // Arrange
        const length = 5;
        const width = 2;
        const spyAdd = vi.spyOn(MathBasic, "add")
        const spyMultiply = vi.spyOn(MathBasic, "multiply");
        const figureCalculator = new FigureCalculator(MathBasic);

        // Action
        const result = figureCalculator.calculateTriangleArea(length,width);

        // Assert
        expect(result).toEqual(3.5);
        expect(spyAdd).toHaveBeenCalledWith(length,width)
        expect(spyMultiply).toHaveBeenCalledWith(0.5,7);
    })
})