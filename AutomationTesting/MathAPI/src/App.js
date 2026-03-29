import createServer from "./CreateServer.js";
import FigureCalculator from "./FigureCalculator.js"
import MathBasic from "./MathBasic.js"



const start = () => {
    const figureCalculator = new FigureCalculator(MathBasic);
    const app = createServer({
        mathBasic : MathBasic,
        figureCalculator
    });

    const host = 'localhost';
    const port = 3000;
    const server = app.listen(port,host,()=>{
        console.log(`Server start at http://${host}:${port}`);
    })

    return server;
}
start()