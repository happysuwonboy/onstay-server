import express from 'express';
import multer from 'multer';
import path from 'path';
import uuid from 'uuid4';
import * as roomController from '../controller/roomController.js';

const router = express.Router();

const reviewImgUpload = multer({
  storage : multer.diskStorage({
    filename(req, file, done) {
      const randomId = uuid(); // 랜덤 아이디 생성
      const ext = path.extname(file.originalname);
      const fileName = randomId + ext;
      done(null, fileName);
    },
    destination(req, file, done) {
      done(null, path.join(path.resolve(), 'uploads', 'reviewfile'));
    }
  })
});

const uploadMiddleWare = reviewImgUpload.single('review_img');

router.get('/:roomid', roomController.getAccRoom);
router.get('/date/:roomid', roomController.getRoomDate);
router.post('/review', uploadMiddleWare, roomController.insertReview); // 리뷰 등록
router.put('/review/mypage/update', uploadMiddleWare, roomController.updateReview); // 리뷰 수정
router.get('/review/:roomid/:currentPage', roomController.getReview); // 리뷰 리스트 목록 조회 ( 페이지네이션 )
router.get('/:roomid/:userid', roomController.getIsRegister); // 리뷰 등록 가능 여부 ( 예약정보까지 함께 확인 )

export default router;