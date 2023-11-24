import express from 'express';
import cors from 'cors';
import accRouter from './router/accRouter.js'

const server = express();
const PORT = 8000;

server.use(cors());
server.use(express.json());
server.use(express.urlencoded());

server.use('/acc', accRouter)


server.listen(PORT, ()=>{console.log(`listening on ${PORT}`)});