import {db} from '../db/database.js';

/**
 * getAccRoom : 숙소에 해당하는 모든 객실 리스트 조회
 * @param {*} roomid 
 * @returns rows 데이터
 */
export async function getAccRoom(roomid) {
  const sql = `select ac.acc_id, ac.acc_name, ac.acc_summary1, acc_checkin, acc_checkout, 
                      rm.room_id, rm.room_name, rm.feature_codes, rm.amenities, 
                      rm.min_capa, rm.max_capa, rm.room_img1, rm.room_img2, rm.room_img3
                  from accommodation ac, room rm 
                    where ac.acc_id = rm.acc_id
                    and rm.acc_id in (select acc_id from room where room_id = ?)`;

  return db
    .execute(sql, [roomid])
    .then(result => result[0]);
};