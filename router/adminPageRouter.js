import express from "express";
import multer from 'multer';
import path from 'path';
import uuid from 'uuid4';
import * as adminPageController from '../controller/adminPageController.js';

const router = express.Router();

const roomImgUpload = multer({
    storage: multer.diskStorage({
        filename(req, file, done) {
            console.log(file);
            const randomID = uuid();
            const ext = path.extname(file.originalname);
            const filename = randomID + ext;
            done(null, filename);
        },
        destination(req, file, done) {
            console.log(file);
            done(null, path.join(path.resolve(), 'uploads', 'roomfile'))
        }
    })
})

const uploadMiddleware = roomImgUpload.single('roomImg1'); //미들웨어 생성

router.get('/accs/:page', adminPageController.getAccList);
router.post('/accs/insert/', uploadMiddleware, adminPageController.insertAcc);

export default router;