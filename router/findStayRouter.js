import express from 'express';
import * as findStayController from '../controller/findStayController.js';

const router = express.Router();

router.get('/', findStayController.getAccList);

export default router;