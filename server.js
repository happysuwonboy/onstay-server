import express from 'express';
import cors from 'cors';
import newStayRouer from './router/newStayRouter.js';
import categoryRouter from './router/categoryRouter.js';
import accRouter from './router/accRouter.js';
import memberRouter from './router/memberRouter.js';
import myPageRouter from './router/myPageRouter.js';
import cookieParser from 'cookie-parser';
import accRouter from './router/accRouter.js'
import findStayRouter from './router/findStayRouter.js';

const server = express();
const PORT = 8000;

server.use(cors({
  origin : 'http://localhost:3000',
  credentials : true,
  methods : ['GET', 'POST', 'DELETE']
}));
server.use(express.json());
server.use(express.urlencoded());
server.use(cookieParser())

server.use('/', categoryRouter);
server.use('/acc', accRouter)
server.use('/newstay', newStayRouer);
server.use('/member', memberRouter)
server.use('/mypage', myPageRouter);
server.use('/findstay', findStayRouter);

server.listen(PORT, ()=>{console.log(`listening on ${PORT}`)});