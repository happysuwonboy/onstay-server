import express from 'express';
import path from 'path';

const router = express.Router()
const __dirname = path.resolve();

const getStatic = (...folders) => express.static(path.join(__dirname, ...folders))


router.use('/acc', getStatic('assets', 'images', 'acc'), getStatic('assets', 'images', 'swiper'));
router.use('/room', getStatic('assets', 'images', 'room'));
router.use('/userprofile', getStatic('uploads', 'userprofile'))
router.use('/noticeimg', getStatic('uploads', 'noticefile'))
router.use('/reviewimg', getStatic('uploads', 'reviewfile'))











export default router