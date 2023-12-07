import * as reservationRepository from '../repository/reservationRepository.js';

/**
 * getRoomInfo : 숙소 객실에 해당하는 정보 리스트 조회
 * @param {*} req 
 * @param {*} res 
 */ 
export async function getRoomInfo(req, res) {
  const roomId = req.params.roomid;
  const row = await reservationRepository.getRoomInfo(roomId);
  res.json(row);
}

/**
 * getUserInfo : 해당 회원의 정보와 보유 쿠폰 리스트 조회
 * @param {*} req 
 * @param {*} res 
 */
export async function getUserInfo(req, res) {
  const userId = req.params.userid;
  const rows = await reservationRepository.getUserInfo(userId);
  res.json(rows);
}

/**
 * insertDelete : 예약 내역 추가 insert 및 회원 쿠폰 사용 여부에 따른 delete
 * @param {*} req 
 * @param {*} res 
 */
export async function insertDelete(req, res) {
  const { userId, roomId, startDate, endDate, selectedCouponId } = req.body;
  const data = { userId, roomId, startDate, endDate, selectedCouponId };

  try {
    // 예약 날짜 중복 체크
    const result = await reservationRepository.isReservation(data);
    // 예약 실패 : 예약 날짜 중복
    if (result.cnt !== 0 )  { 
      return res.status(200).send({ message : '예약 날짜 오류'});
    }
    
    // 예약 가능 : insert 실행
    const insertResult =  await reservationRepository.insertReservation(data);
    
    // insert 성공 + 사용 쿠폰 있다면 delete 실행
    if ( insertResult === 'insert ok' && selectedCouponId ) {
      const deleteResult = await reservationRepository.deleteCoupon(selectedCouponId);
      // delete 실패 처리
      (deleteResult !== 'delete ok') && res.status(200).send({ message: 'delete 오류' });
    } 
    res.json({ message: 'success'});
  } catch (error) {
    res.status(500).send({ message : '서버 오류'});
  } 
}