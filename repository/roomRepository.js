import {db} from '../db/database.js';

/**
 * getAccRoom : 숙소에 해당하는 모든 객실 리스트 조회
 * @param {*} roomId 
 * @returns rows 데이터
 */
export async function getAccRoom(roomId) {
  const sql = `select 
                  ac.acc_id, 
                  ac.acc_name, 
                  ac.acc_summary1, 
                  acc_checkin,
                  acc_checkout,
                  ac.pet,
                  rm.room_id,
                  rm.room_name, 
                  rm.room_price, 
                  rm.feature_codes, 
                  rm.amenities,  
                  rm.min_capa,
                  rm.max_capa, 
                  rm.room_img1,
                  rm.room_img2, 
                  rm.room_img3
                from accommodation ac, room rm 
                where ac.acc_id = rm.acc_id
                and rm.acc_id in (select acc_id from room where room_id = ?)`;

  return db
    .execute(sql, [roomId]) 
    .then(result => result[0]);
};

/**
 * getRoomDate : 해당하는 숙소의 오늘 날짜 이후 체크인, 체크아웃 예약 리스트 조회
 * @param {*} roomId
 * @returns rows 데이터
 */
export async function getRoomDate(roomId) {
  const sql = `select room_id, checkin, checkout
                from reservation
                where (checkin > current_date() or checkout > current_date())
                and room_id = ?`;

  return db
    .execute(sql, [roomId])
    .then(result => result[0]);
}

/**
 * getReview : 해당하는 숙소의 리뷰 리스트와 user_name 조회
 * @param {*} roomId 
 * @returns rows 데이터
 */
export async function getReview(roomId) {
  const sql = `select 
                  rv.review_id, 
                  rv.user_id, 
                  rv.review_content, 
                  rv.review_img, 
                  rv.review_star, 
                  rv.register_date,
                  ur.user_name
              from review rv, user ur
              where rv.user_id = ur.user_id
              and room_id = ?`;

  return db
    .execute(sql, [roomId])
    .then(result => result[0]);
}

/**
 * getReservation : 해당 회원, 해당 객실의 체크아웃 이후 예약 리스트 조회 ( 리뷰 등록 가능 기준 )
 * @param {*} roomid 
 * @param {*} userid 
 * @returns 
 */
export async function getReservation(roomid, userid) {
  const sql = `select count(*) as cnt from reservation 
                where user_id = ?
                and room_id = ?
                and checkout < curdate()`;

  return db
    .execute(sql, [userid, roomid])
    .then(result => result[0][0])
}