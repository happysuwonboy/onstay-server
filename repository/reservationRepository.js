import {db} from '../db/database.js';

/**
 * getRoomInfo : 객실에 해당하는 정보 리스트 조회
 * @param {*} roomId 
 * @returns row 데이터
 */
export async function getRoomInfo(roomId) {
  const sql = `select acc_name, acc_checkin, acc_checkout, room_name, room_price, max_capa
                from accommodation ac, room rm
                where ac.acc_id = rm.acc_id
                and room_id = ?`;

  return db
    .execute(sql, [roomId])
    .then(result => result[0][0]);
}

/**
 * getUserInfo : 회원의 정보와 보유 쿠폰 리스트 조회
 * @param {*} userId 
 * @returns rows 데이터
 */
export async function getUserInfo(userId) {
  const sql = `select us.user_id, user_name, user_email, user_phone, coupon_id, coupon_name, discount_price
                from user us left outer join coupon cp
                on us.user_id = cp.user_id
                where us.user_id = ?`;

  return db
    .execute(sql, [userId])
    .then(result => result[0]);
}

/**
 * insertReservation : 결제 완료한 예약 내역 정보 insert 
 * @param {*} data :  userId, roomId, startDate, endDate
 * @returns 성공 여부 메세지
 */
export async function insertReservation(data) {
  const { userId, roomId, startDate, endDate } = data;

  const sql = `insert into
                  reservation (user_id, room_id, pay_date, checkin, checkout)
                  values(?, ?, sysdate(), ?, ?)`;

  return db
    .execute(sql, [ userId, roomId, startDate, endDate ])
    .then(result => 'insert ok');
}


/**
 * deleteCoupon : 쿠폰 사용 여부에 따른 쿠폰 정보 delete
 * @param {*} selectedCouponId : 쿠폰 id
 * @returns 성공 여부 메세지
 */
export async function deleteCoupon(selectedCouponId) {
  const sql = `delete from coupon where coupon_id = ?`;

  return db
    .execute(sql, [selectedCouponId])
    .then(result => 'delete ok');
}