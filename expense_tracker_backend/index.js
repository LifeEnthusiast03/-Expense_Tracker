import express from 'express';
import cors from 'cors';
import { createServer } from 'http';

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
