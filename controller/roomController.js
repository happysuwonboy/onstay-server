import * as roomRepository from '../repository/roomRepository.js';

/**
 * getAccRoom : 숙소에 해당하는 모든 객실 리스트 조회
 * @param {*} req 
 * @param {*} res 
 */
export async function getAccRoom(req, res) {
  const roomid = req.params.roomid;

  const row = await roomRepository.getAccRoom(roomid);
  res.json(row);
}