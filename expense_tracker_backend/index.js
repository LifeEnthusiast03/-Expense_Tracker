import express from 'express';
import cors from 'cors'; // Fixed: Added missing closing quote
import { createServer } from 'http';
import dotenv from 'dotenv';
import connectDb from './config/database.js';

dotenv.config();
connectDb();

const app = express();
const server = createServer(app);
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    console.log('this is home page');
    res.send('Welcome to the home page!');
});

server.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});