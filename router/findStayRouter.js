import express from 'express';
import * as findStayController from '../controller/findStayController.js';

const router = express.Router();

router.get('/', findStayController.getAccList);
router.get('/love/:userId', findStayController.getUserLoveAccList);
router.post('/love', findStayController.addLove);
router.delete('/love', findStayController.removeLove);

export default router;