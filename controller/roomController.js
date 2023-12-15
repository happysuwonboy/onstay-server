import * as roomRepository from '../repository/roomRepository.js';

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
  const start = (currentPage - 1) * 5
  const end = start + 4;

  const rows = await roomRepository.getReview(roomid, start, end);
  res.json(rows);
}

/**
 * getReservation : 해당 회원, 해당 객실의 체크아웃 이후 예약 리스트 조회 ( 리뷰 등록 가능 기준 )
 * @param {*} req 
 * @param {*} res 
 */
export async function getReservation(req, res) {
  const {roomid, userid} = req.params;
  const rows = await roomRepository.getReservation(roomid, userid);
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
  // console.log({roomid, userid});

  try {
    // 체크아웃 날짜 이후의 한달 이내 예약 정보 리스트 조회
    const reservationResult = await roomRepository.getIsReservation(roomid, userid);
    
    // 예약 리스트 조회 결과 조건 일치 x
    if(reservationResult.length <= 0) {
      return res.status(200).send({message : '예약 x'});
    } 

    // 리뷰 리스트 조회 결과 조건 일치 o
    const reviewResult = await roomRepository.getIsReview(roomid, userid);
    if(reviewResult.length <= 0) {
      return res.status(200).send({message : '리뷰 x'});
    } 

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