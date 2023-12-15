import express from 'express';
import * as roomController from '../controller/roomController.js';

const router = express();
router.get('/:roomid', roomController.getAccRoom);
router.get('/date/:roomid', roomController.getRoomDate);
router.get('/review/:roomid/:currentPage', roomController.getReview);
router.get('/:roomid/:userid', roomController.getIsRegister); 

export default router;