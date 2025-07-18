import express from 'express'
import cors from 'cors'
import {createServer} from 'http'
import dotenv from 'dotenv'
import connectDb from './config/database'

dotenv.config()
connectDb()

const app = express();
const server = createServer(app);

app.use(cors())
app.use(express.json())

const PORT:number = 5000;

app.get('/',async(req,res)=>{
    res.send('This is home page');
})

server.listen(PORT,()=>{
    console.log('SERVER RUNNING ON PORT 500');
    
})