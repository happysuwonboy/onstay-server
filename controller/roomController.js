import * as roomRepository from '../repository/roomRepository.js';

/**
 * getAccRoom : 숙소에 해당하는 모든 객실 리스트 조회
 * @param {*} req 
 * @param {*} res 
 */
export async function getAccRoom(req, res) {
  const roomid = req.params.roomid;

  const rows = await roomRepository.getAccRoom(roomid);
  res.json(rows);
}

/**
 * getRoomDate : 해당하는 숙소의 오늘 날짜 이후 체크인, 체크아웃 예약 리스트 조회
 * @param {*} req 
 * @param {*} res 
 */
export async function getRoomDate(req, res) {
  const roomid = req.params.roomid;

  const rows = await roomRepository.getRoomDate(roomid);
  res.json(rows);
}