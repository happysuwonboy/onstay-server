import express from 'express';
import * as newStayController from '../controller/newStayController.js';

const router = express.Router();

router.get('/', newStayController.getList);

export default router;