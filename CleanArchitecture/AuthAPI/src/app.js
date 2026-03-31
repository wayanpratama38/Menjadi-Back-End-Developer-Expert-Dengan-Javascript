import express from 'express';


const app = new express();

app.get('/',(req,res)=>{
    res.json({success: true})
})


app.listen(3000,"localhost",()=>{
    console.log(`Server running at http://localhost:3000`)
})

