import express from 'express';
import * as findStayController from '../controller/findStayController.js';

const router = express.Router();

router.get('/', findStayController.getAccList);
router.get('/love', findStayController.getLoveAccList);
router.post('/love', findStayController.addLove);
router.delete('/love', findStayController.removeLove);
router.put('/love', findStayController.addAccLove);

export default router;