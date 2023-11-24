import express from 'express';
import cors from 'cors';
import categoryRouter from './router/categoryRouter.js';

const server = express();
const PORT = 8000;

server.use(cors());
server.use(express.json());
server.use(express.urlencoded());

server.use('/', categoryRouter);

server.listen(PORT, ()=>{console.log(`listening on ${PORT}`)});