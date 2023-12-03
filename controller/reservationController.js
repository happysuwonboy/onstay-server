import * as reservationRepository from '../repository/reservationRepository.js';

/**
 * getRoomInfo : 숙소 객실에 해당하는 정보 리스트 조회
 * @param {*} req 
 * @param {*} res 
 */ 
export async function getRoomInfo(req, res) {
  const roomid = req.params.roomid;
  const row = await reservationRepository.getRoomInfo(roomid);
  res.json(row);
}

/**
 * getUserInfo : 해당 회원의 정보와 보유 쿠폰 리스트 조회
 * @param {*} req 
 * @param {*} res 
 */
export async function getUserInfo(req, res) {
  const userid = req.params.userid;
  const rows = await reservationRepository.getUserInfo(userid);
  res.json(rows);
}