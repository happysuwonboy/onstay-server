import express from 'express';
import cors from 'cors';
import newStayRouer from './router/newStayRouter.js';
import categoryRouter from './router/categoryRouter.js';
import accRouter from './router/accRouter.js';
import roomRouter from './router/roomRouter.js';
import reservationRouter from './router/reservationRouter.js'
import memberRouter from './router/memberRouter.js';
import myPageRouter from './router/myPageRouter.js';
import cookieParser from 'cookie-parser';
import findStayRouter from './router/findStayRouter.js';
import noticeRouter from './router/noticeRouter.js';
import path from 'path';

const server = express();
const PORT = 8000;
const currentDir = path.dirname(new URL(import.meta.url).pathname);

server.use(cors({
  origin : 'http://localhost:3000',
  credentials : true,
  methods : ['GET', 'POST', 'DELETE']
}));
server.use(express.json());
server.use(express.urlencoded());
server.use(cookieParser());
server.use('/uploads', express.static(path.join(currentDir, 'uploads')));// 이미지 서빙 미들웨어

server.use('/', categoryRouter);
server.use('/acc', accRouter);
server.use('/newstay', newStayRouer);
server.use('/notice', noticeRouter);
server.use('/room', roomRouter);
server.use('/reservation', reservationRouter);
server.use('/member', memberRouter)
server.use('/mypage', myPageRouter);
server.use('/findstay', findStayRouter);

server.listen(PORT, ()=>{console.log(`listening on ${PORT}`)});