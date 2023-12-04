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
  let couponResult = '';
  
  const result = await reservationRepository.insertReservation(data);

  result === 'insert ok' 
  ? couponResult = await reservationRepository.deleteCoupon(selectedCouponId)
  : res.status(200).send({message:'insert 오류'});
  
  res.json(couponResult);
}