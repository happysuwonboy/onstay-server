import express from 'express';
import * as newStayController from '../controller/newStayController.js';

const router = express.Router();

router.get('/home', newStayController.getList);
router.get('/today/:page', newStayController.getTodayAcc);
router.post('/today/coupon', newStayController.addCoupon);
router.post('/', newStayController.getAccList);

export default router;