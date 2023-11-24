import express from 'express';
import cors from 'cors';
import newStayRouer from './router/newStayRouter.js';
import categoryRouter from './router/categoryRouter.js';
import accRouter from './router/accRouter.js'

const server = express();
const PORT = 8000;

server.use(cors());
server.use(express.json());
server.use(express.urlencoded());

server.use('/', categoryRouter);
server.use('/acc', accRouter)
server.use('/newstay', newStayRouer);

server.listen(PORT, ()=>{console.log(`listening on ${PORT}`)});