import express from 'express';
import * as memberController from '../controller/memberController.js';

const router = express.Router()


/** 아이디 중복 체크  */
router.get('/duplication/:user_id', memberController.userIdDuplicationCheck) 

/** 회원가입 */
router.post('/join', memberController.userJoin) // 회원가입

/** 로그인 */
router.post('/login', memberController.userLogin)



export default router