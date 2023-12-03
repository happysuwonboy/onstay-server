import {db} from '../db/database.js';

/**
 * getRoomInfo : 객실에 해당하는 정보 리스트 조회
 * @param {*} roomid 
 * @returns row 데이터
 */
export async function getRoomInfo(roomid) {
  const sql = `select acc_name, acc_checkin, acc_checkout, room_name, room_price, max_capa
                from accommodation ac, room rm
                where ac.acc_id = rm.acc_id
                and room_id = ?`;

  return db
    .execute(sql, [roomid])
    .then(result => result[0][0]);
}

/**
 * getUserInfo : 회원의 정보와 보유 쿠폰 리스트 조회
 * @param {*} userid 
 * @returns rows 데이터
 */
export async function getUserInfo(userid) {
  const sql = `select us.user_id, user_name, user_email, user_phone, coupon_id, coupon_name, discount_price
                from user us left outer join coupon cp
                on us.user_id = cp.user_id
                where us.user_id = ?`;

  return db
    .execute(sql, [userid])
    .then(result => result[0]);
}