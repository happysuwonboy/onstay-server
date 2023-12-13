import express from 'express';
import * as roomController from '../controller/roomController.js';

const router = express();
router.get('/:roomid', roomController.getAccRoom);
router.get('/date/:roomid', roomController.getRoomDate);
router.get('/review/:roomid', roomController.getReview);
router.get('/:roomid/:userid', roomController.getReservation);

export default router;