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
 * register_date 최신 작성일 순서
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
export async function getReview(roomid, start, end) {
  const sql = `with all_review as (
                select 
                  rv.review_id,
                    rv.user_id,
                    rv.review_content,
                    rv.review_img,
                    rv.review_star,
                    rv.register_date,
                    ur.user_name,
                    row_number() over (order by rv.register_date desc) as rno
                from review rv, user ur
                  where rv.user_id = ur.user_id
                  and rv.room_id = ?
                )
              
              select 
                rno,
                review_id,
                user_id,
                review_content,
                review_img,
                review_star,
                register_date,
                user_name,
                (select count(*) from all_review) as total_cnt,
                round((select avg(review_star) from all_review), 1) as avg_star
              from all_review
              where rno between ? and ?`;
              
  return db
    .execute(sql, [roomid, start, end])
    .then(result => result[0]);
}

/**
 * getIsReview
 * 오늘 날짜 기준 예약 리스트 중 해당 회원, 해당 객실, 리뷰 등록 가능 한달 조건에 충족하는 리스트 반환
 * ( 예약 작성 가능 남은 일수 포함 )
 * @param {*} roomid 
 * @param {*} userid 
 * @returns rows 데이터
 */
export async function getIsReservation(roomid, userid) {
  const sql = `select 
                  reservation_id,
                  user_id,
                  room_id,
                  date_format(checkin, '%Y-%m-%d') as checkin, 
                  date_format(checkout, '%Y-%m-%d') as checkout, 
                  datediff(date_add(checkout, interval + 1 month), curdate()) as remaining_days
                from reservation
                where user_id = ?
                and room_id = ?
                and curdate() between checkout and date_add(checkout, interval + 1 month)
                order by checkin`;

  return db
    .execute(sql, [userid, roomid])
    .then(result => result[0]);
}

/**
 * getIsReview 
 * 오늘 날짜 기준 리뷰 리스트 중 해당 회원, 해당 객실, 리뷰 등록 가능 한달 조건에 충족하는 리스트 체크아웃 반환
 * @param {*} roomid 
 * @param {*} userid 
 * @returns rows 데이터
 */
export async function getIsReview(roomid, userid) {
  const sql = `select 
                  date_format(checkout, '%Y-%m-%d') as checkout 
                from review
                where user_id = ?
                and room_id = ?
                and curdate() between checkout and date_add(checkout, interval + 1 month)
                order by checkin`;

  return db
    .execute(sql, [userid, roomid])
    .then(result => result[0]);
}

/**
 * insertReview : 회원이 작성한 리뷰 등록 insert
 * @param {*} reviewForm 
 * @param {*} review_img
 * @returns insert ok
 */
export async function insertReview(reviewForm, {review_img}) {
  const { user_id, room_id, review_content, review_star, checkin, checkout } = reviewForm;
  const sql = `insert into 
                  review (room_id, user_id, review_content, review_img, review_star, register_date, checkin, checkout) 
                  values(?, ?, ?, ?, ?, sysdate(), ?, ?)`;

  return db
    .execute(sql, [ room_id, user_id, review_content, review_img, review_star, checkin, checkout ])
    .then(result => 'insert ok');
}

/**
 * updateReview : 회원이 작성한 리뷰 수정 update
 * @param {*} formData 
 * @returns update ok
 */
export async function updateReview(formData) {
  const { review_id, room_id, user_id, review_img, review_content, review_star, checkin, checkout } = formData;
  const sql = `update review set room_id=?, user_id=?, review_content=?, review_img=?, review_star=?, checkin=?, checkout=? where review_id=?`;

  return db
    .execute(sql, [ room_id, user_id, review_content, review_img, review_star, checkin, checkout, review_id ])
    .then(result => 'update ok');
}