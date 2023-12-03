import express from 'express';
import * as memberController from '../controller/memberController.js';

const router = express.Router()


/** 아이디 중복 체크  */
router.get('/duplication/:user_id', memberController.userIdDuplicationCheck) 

/** 회원가입 */
router.post('/join', memberController.userJoin) // 회원가입

/** 로그인 */
router.post('/login', memberController.userLogin)

/** 로그아웃 */
router.post('/logout', memberController.userLogout)

/** 액세스 토큰 및 리프레쉬 토큰 체크 */
router.get('/tokenCheck', memberController.tokenCheck)

/** 유저 정보 조회 */
router.get('/userinfo/:user_id', memberController.getUserInfo);




export default router