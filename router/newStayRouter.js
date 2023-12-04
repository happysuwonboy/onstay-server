import express from 'express';
import * as newStayController from '../controller/newStayController.js';

const router = express.Router();

router.get('/home', newStayController.getList);
router.post('/', newStayController.getAccList);

export default router;