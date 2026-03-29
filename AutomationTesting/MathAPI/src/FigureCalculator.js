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
    calculateRectangleArea(...args) { 
        if(args.length!==2) {
            throw new Error("Memerlukan dua parameter")
        }

        const [a,b] = args;

        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new Error('fungsi hanya menerima parameter number');
        }

        return this._mathBasic.multiply(a,b);
    }

    calculateTrianglePerimeter(...args) {
        if(args.length!==3) {
            throw new Error("Memerlukan tiga parameter")
        }

        const [a,b,c] = args;

        if (typeof a !== 'number' || typeof b !== 'number' || typeof c !== 'number') {
            throw new Error('fungsi hanya menerima parameter number');
        
        }

        return this._mathBasic.add(this._mathBasic.add(a,b),c);
    }

    calculateTriangleArea(...args) {
        if(args.length!==2) {
            throw new Error("Memerlukan dua parameter")
        }

        const [a,b] = args;

        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new Error('fungsi hanya menerima parameter number');
        }

        return this._mathBasic.multiply(0.5,this._mathBasic.add(a,b));
     }
}