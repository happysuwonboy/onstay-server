import * as roomRepository from '../repository/roomRepository.js';
import { isUserReview } from '../repository/myPageRepository.js'; 

/**
 * getAccRoom : 숙소에 해당하는 모든 객실 리스트 조회
 * @param {*} req 
 * @param {*} res 
 */
export async function getAccRoom(req, res) {
  const roomId = req.params.roomid;

  const rows = await roomRepository.getAccRoom(roomId);
  res.json(rows);
}

/**
 * getRoomDate : 해당하는 숙소의 오늘 날짜 이후 체크인, 체크아웃 예약 리스트 조회
 * @param {*} req 
 * @param {*} res 
 */
export async function getRoomDate(req, res) {
  const roomId = req.params.roomid;
  const rows = await roomRepository.getRoomDate(roomId);
  res.json(rows);
}

/**
 * getReview: 페이지네이션 클릭 해당하는 숙소의 리뷰 리스트와 user_name 조회
 * @param {*} req 
 * @param {*} res 
 */
export async function getReview(req, res) {
  const {roomid, currentPage} = req.params;
  const end = 4 * currentPage;
  const start = (end - 3);

  const rows = await roomRepository.getReview(roomid, start, end);
  res.json(rows);
}

/**
 * getIsRegister 
 * 체크아웃 날짜 이후 한달 ( 리뷰 등록 가능 기준 ) 조건과 해당 회원, 해당 객실 조건에 맞는 예약 정보 및 리뷰 리스트 조회
 * 예약 정보 리스트와 리뷰 리스트에 중복되지 않은 ( 등록 되지 않은 리뷰 ) 데이터 반환
 * @param {*} req 
 * @param {*} res 
 * @returns rows 데이터
 */
export async function getIsRegister(req, res) {
  const {roomid, userid} = req.params;

  try {
    // 체크아웃 날짜 이후의 한달 이내 예약 정보 리스트 조회
    const reservationResult = await roomRepository.getIsReservation(roomid, userid);
    
    // 예약 리스트 조회 결과 조건 일치 x
    if(reservationResult.length <= 0) {
      return res.status(404).send({message : '일치하는 예약 정보가 없습니다'});
    } 

    // 리뷰 리스트 조회 결과
    const reviewResult = await roomRepository.getIsReview(roomid, userid);

    // 리뷰 중에서 체크아웃 날짜가 정확하게 일치하지 않는 경우만 포함
    const result = reservationResult.filter(reservation => {
      return !reviewResult.map(review => new Date(review.checkout).toDateString()).includes(new Date(reservation.checkout).toDateString());
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).send({ message : '서버 오류' });
  }
}

/**
 * insertReview : 회원이 작성한 리뷰 등록 insert
 * @param {*} req 
 * @param {*} res 
 */
export async function insertReview(req, res) {
  const reviewForm = req.body;
  const review_img = req.file?.filename || null;

  const result = await roomRepository.insertReview(reviewForm, {review_img});
  res.json(result);
}

/**
 * updateReview : 회원이 작성한 리뷰 updadte
 * @param {*} req 
 * @param {*} res 
 * @returns 진행 처리 결과 ( 회원, 리뷰가 없거나 , 서버 오류 )
 */
export async function updateReview(req, res) {
    const formData = {
      ...req.body, // 이미지 파일 이외의 필드는 req.body에서 가져오기
      review_img: req.file ? req.file?.filename : req.body.review_img // 이미지 파일이 있는 경우 파일 이름 저장
    };

    try{
      // 존재하는 회원 + 작성한 리뷰가 있는지 확인
      const isUserReviewResult = await isUserReview(formData.user_id, formData.review_id);

      // 조회 결과 일치하는 회원이 아니거나 작성한 리뷰 x
      if(isUserReviewResult === 0) {
        return res.status(404).send({message : '리뷰, 회원이 존재하지 않습니다'})
      }

      const result = await roomRepository.updateReview(formData);
      if(result === 'update ok') {
        res.json(result);
      } else {
        return res.status(404).send({message : '리뷰 수정 실패하였습니다'})
      }
    }catch(error) {
      res.status(500).send({message : '서버 오류', error: error.message})
    }
}