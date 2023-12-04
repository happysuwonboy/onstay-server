import express from 'express';
import * as myPageController from '../controller/myPageController.js';

const router = express.Router();

// 유저 별 예약 정보 뿌려주는 api
router.get('/reservation/:user_id', myPageController.getUserReservation)

export default router