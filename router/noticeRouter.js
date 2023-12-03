import express from 'express';
import * as noticeController from '../controller/noticeController.js';

const router = express.Router();

router.post('/', noticeController.getNoticeList);
router.get('/increase/:noticeId', noticeController.updateViewCount);
router.get('/:noticeid/:page', noticeController.geDetailNotice);

export default router;