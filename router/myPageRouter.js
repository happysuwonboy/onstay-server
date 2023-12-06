import express from 'express';
import * as myPageController from '../controller/myPageController.js';
import multer from 'multer';
import path from 'path';
import uuid  from 'uuid4';

const router = express.Router();

const profileImgUpload = multer({
    storage : multer.diskStorage({
        filename(req,file,done) {
            const randomId = uuid(); // 랜덤 아이디를 생성해줌
            const ext = path.extname(file.originalname);
            const fileName = randomId + ext;
            done(null, fileName);
        },
        destination(req, file, done) {
            done(null, path.join(path.resolve(), 'uploads', 'userprofile')) 
        }
    })
})

const uploadMiddleWare = profileImgUpload.single('file')

// 유저 별 예약 정보 뿌려주는 api
router.get('/reservation/:user_id', myPageController.getUserReservation)

// 예약 취소 api
router.delete('/reservation', myPageController.cancelReservation)

// 유저 패스워드 변경 api 
router.post('/edit/pw', myPageController.editPassword)

// 유저 정보 변경 api
router.post('/edit/userinfo', uploadMiddleWare,  myPageController.editUserInfo) 

// 유저 탈퇴 api 
router.delete('/quit', myPageController.quitMember)

// 1:1 문의 작성 api
router.post('/question', myPageController.postQuestion)

// 1:1 문의 아이디로 정보 조회
router.get('/question/:question_id', myPageController.getQuestion)

// 유저 별 1:1 문의 내역 조회 api
router.get('/questions/:user_id', myPageController.getQuestions)

export default router