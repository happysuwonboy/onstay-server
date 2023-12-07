import express from 'express';
import * as noticeController from '../controller/noticeController.js';
import multer from 'multer';
import path from 'path';
import uuid from 'uuid4';

const router = express.Router();

const noticeImgUpload = multer({
    storage: multer.diskStorage({
        filename(req, file, done) {
            const randomId = uuid(); // 랜덤 아이디를 생성해줌
            const ext = path.extname(file.originalname);
            const fileName = randomId + ext;
            done(null, fileName);
        },
        destination(req, file, done) {
            done(null, path.join(path.resolve(), 'uploads', 'noticefile'))
        }
    })
})

const uploadMiddleWare = noticeImgUpload.single('file')

router.post('/', noticeController.getNoticeList);
router.post('/insert', uploadMiddleWare, noticeController.insertNotice);
router.post('/update', noticeController.updateNotice);
router.delete('/delete', noticeController.deleteNotice);
router.get('/increase/:noticeId', noticeController.updateViewCount);
router.get('/:noticeid/:page', noticeController.geDetailNotice);

export default router;