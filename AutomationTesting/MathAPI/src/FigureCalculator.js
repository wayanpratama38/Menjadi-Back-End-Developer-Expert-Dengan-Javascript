export default class FigureCalculator{
    constructor(mathBasic){
        this._mathBasic = mathBasic
    }

    calculateRectanglePerimeter(...args) {
        if(args.length!==2) {
            throw new Error("Memerlukan dua parameter")
        }

        const [a,b] = args;

        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new Error('fungsi hanya menerima parameter number');
        
        }

        return this._mathBasic.multiply(2,this._mathBasic.add(a,b));

    }
    calculateRectangleArea() { }
    calculateTrianglePerimeter() { }
    calculateTriangleArea() { }
}