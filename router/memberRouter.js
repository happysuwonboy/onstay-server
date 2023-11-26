import express from 'express';
import * as memberController from '../controller/memberController.js';

const router = express.Router()


router.get('/duplication/:user_id', memberController.userIdDuplicationCheck)
router.post('/join', memberController.userJoin)



export default router