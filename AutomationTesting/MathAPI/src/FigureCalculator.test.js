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

        // action
        const result = figureCalculator.calculateRectanglePerimeter(length,width);

        expect(result).toEqual(60);
        expect(spyAdd).toHaveBeenCalledWith(length,width);
        expect(spyMultiply).toHaveBeenCalledWith(2,30);
    })


})