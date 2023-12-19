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

{/**예약 */}

// 유저 별 예약 내역 뿌려주는 api (all : 전체,  upcoming : 다가오는 예약, complete : 이용 완료)
router.get('/reservation/:category/:user_id', myPageController.getUserReservations)

// 예약 취소 api
router.delete('/reservation', myPageController.cancelReservation)

/* 리뷰 관리 */
router.get('/review/:user_id/:currentPage', myPageController.getAllReview); // 리뷰관리 리뷰 목록 ( 페이지네이션 )
router.get('/review/:reviewid', myPageController.getReview); // 리뷰 수정하기 클릭 시 해당하는 리뷰의 정보
router.delete('/review/delete', myPageController.removeReview); // 리뷰 삭제


{/* 회원 정보 수정 */}

// 유저 패스워드 변경 api 
router.post('/edit/pw', myPageController.editPassword)

// 유저 정보 변경 api (프로필 사진 파일 업로드 포함)
router.post('/edit/userinfo', uploadMiddleWare,  myPageController.editUserInfo) 

// 유저 탈퇴 api 
router.delete('/quit', myPageController.quitMember)


{/**1:1 문의 */}

// 1:1 문의 등록 
router.post('/question', myPageController.postQuestion)

// 1:1 문의 아이디로 정보 조회
router.get('/question/:question_id', myPageController.getQuestion)

// 1:1 문의 수정 
router.put('/question', myPageController.updateQuestion)

// 1:1 문의 삭제
router.delete('/question', myPageController.deleteQuestion)

// 유저 별 1:1 모든 문의 내역 조회 api
router.get('/questions/:user_id', myPageController.getQuestions)


{/**쿠폰 */}

// 유저 별 모든 쿠폰 조회
router.get('/coupons/:user_id', myPageController.getCoupons)


{/* 관심 스테이 */}

// 유저별 좋아요 누른 숙소 조회
router.get('/lovestay/:user_id', myPageController.getLoveStay)



export default router