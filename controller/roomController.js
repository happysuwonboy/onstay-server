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
 * getReview: 해당하는 숙소의 리뷰 리스트와 user_name 조회
 * @param {*} req 
 * @param {*} res 
 */
export async function getReview(req, res) {
  const roomId = req.params.roomid;
  const rows = await roomRepository.getReview(roomId);
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