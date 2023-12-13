import express from 'express';
import * as memberController from '../controller/memberController.js';
import nodemailer from 'nodemailer';

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
  

{/** 아이디 찾기, 비밀번호 찾기 */}


// 아이디 찾기 - 인증 번호 메일 전송 api 
router.post('/find/certification', memberController.sendCertificationCode)

// 아이디 찾기 - 결과 조회 api 
router.get('/find/id/:user_email', memberController.findIdByEmail)

// 비밀번호 찾기 - 비밀번호 재설정 링크 전송 api
router.post('/find/pw/sendmail', memberController.sendResetPwMail)

// 비밀번호 찾기 - 비밀번호 초기화 (재설정)
router.post('/find/pw/reset', memberController.resetPw)




export default router