
import express from 'express';

const createServer = ({ mathBasic }) => {
    const app = express();
    app.get("/add/:a/:b", (req,res) => {
        const {a,b} = req.params;
        const value = mathBasic.add(Number(a),Number(b));
        res.json({value})
    })
    app.get('/subtract/:a/:b', (request, response) => {
        const { a, b } = request.params;
        const value = mathBasic.subtract(Number(a), Number(b));
        response.json({ value });
    });

    app.get('/multiply/:a/:b', (request, response) => {
        const { a, b } = request.params;
        const value = mathBasic.multiply(Number(a), Number(b));
        response.json({ value });
    });

    app.get('/divide/:a/:b', (request, response) => {
        const { a, b } = request.params;
        const value = mathBasic.divide(Number(a), Number(b));
        response.json({ value });
    });

    app.get('/rectangle/perimeter/:a/:b', (request, response) => {
        const { a, b } = request.params;
        const value = mathBasic.multiply(2,mathBasic.add(Number(a), Number(b)));
        response.json({ value });
    });

    app.get('/triangle/perimeter/:a/:b/:c', (request, response) => {
        const { a, b, c } = request.params;
        const value = mathBasic.add(mathBasic.add(Number(a), Number(b)),Number(c));
        response.json({ value });
    });

    app.get('/triangle/area/:a/:b', (request, response) => {
        const { a, b } = request.params;
        const value = mathBasic.multiply(0.5,mathBasic.add(Number(a), Number(b)));
        response.json({ value });
    });

    app.get('/rectangle/area/:a/:b', (request, response) => {
        const { a, b } = request.params;
        const value = mathBasic.multiply(Number(a),Number(b));
        response.json({ value });
    });

    return app;
}

export default createServer;