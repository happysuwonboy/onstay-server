import express from 'express';
import * as reservationController from '../controller/reservationController.js';

const router = express();

router.get('/:roomid', reservationController.getRoomInfo);
router.get('/user/:userid', reservationController.getUserInfo);
router.post('/booking', reservationController.insertDelete);

export default router;