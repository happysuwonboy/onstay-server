import express from 'express';
import cors from 'cors';
import newStayRouer from './router/newStayRouter.js';

const server = express();
const PORT = 8000;

server.use(cors());
server.use(express.json());
server.use(express.urlencoded());

server.use('/', newStayRouer);

server.listen(PORT, ()=>{console.log(`listening on ${PORT}`)});