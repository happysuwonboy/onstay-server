
import express from 'express';
import cors from 'cors';
import newStayRouer from './router/newStayRouter.js';
import categoryRouter from './router/categoryRouter.js';
import accRouter from './router/accRouter.js';
import roomRouter from './router/roomRouter.js';
import reservationRouter from './router/reservationRouter.js'
import memberRouter from './router/memberRouter.js';
import myPageRouter from './router/myPageRouter.js';
import adminPageRouter from './router/adminPageRouter.js';
import cookieParser from 'cookie-parser';
import findStayRouter from './router/findStayRouter.js';
import noticeRouter from './router/noticeRouter.js';
import imgRouter from './router/imgRouter.js'
import accDetailRouter from './router/accDetailRouter.js';
import accGalleryRouter from './router/accGalleryRouter.js';
import accVisualRouter from './router/accVisualRouter.js';

const server = express();
const PORT = 8000;

server.use(cors({
  origin : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials : true,
  methods : ['GET', 'POST', 'DELETE', 'PUT']
}));

server.use(express.json());
server.use(express.urlencoded());
server.use(cookieParser());

server.use('/', categoryRouter);
server.use('/acc', accRouter);
server.use('/newstay', newStayRouer);
server.use('/notice', noticeRouter);
server.use('/room', roomRouter);
server.use('/reservation', reservationRouter);
server.use('/member', memberRouter)
server.use('/mypage', myPageRouter);
server.use('/adminpage', adminPageRouter);
server.use('/findstay', findStayRouter);
server.use('/getimg', imgRouter)
server.use('/findstay/acc', accDetailRouter);
server.use('/findstay/acc/gallery', accGalleryRouter);
server.use('/visual', accVisualRouter);

server.listen(PORT, ()=>{console.log(`listening on ${PORT}`)});