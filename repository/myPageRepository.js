import { db } from '../db/database.js';

export async function getUserReservations(user_id, filter='') {
  return db
  .execute(`select reservation_id, ac.acc_id, room_name, left(pay_date,10) pay_date,
            rs.room_id, left(checkin,10) checkin_date, left(checkout,10) checkout_date,
            acc_checkin checkin_time, acc_checkout checkout_time, acc_name, 
            if(datediff(checkin,now()) <= 2, false, true) as isCancelable,
            if(datediff(checkout,now()) < -30, false, true) as isReviewable,
            abs(datediff(checkin, checkout)*room_price) as pay_price
            from reservation rs inner join room rm inner join accommodation ac
            on rs.room_id = rm.room_id and rm.acc_id = ac.acc_id
            where ${filter} user_id=?
            order by checkin_date desc`,[user_id])
  .then(result=>result[0])
}

export async function checkReviewExist(user_id, room_id, checkout_date) {
  return db
  .execute(`select if(count(*)=1,true,false) as isReviewExist from review 
            where user_id=? and room_id=? and checkout=?`,[user_id, room_id, checkout_date])
  .then(result => result[0][0].isReviewExist)
  .catch(err => console.log(err))
}

export async function cancelReservation(reservation_id) {
  return db
  .execute(`delete from reservation where reservation_id=?`,[reservation_id])
  .then(result => 'ok')
  .catch(err => console.log(err))
}

/**
 * getAllReview : 해당하는 회원의 작성한 리뷰 리스트 조회 ( 페이지네이션 )
 * @param {*} user_id
 * @param {*} start
 * @param {*} end
 * @returns rows 데이터
 */
export async function getAllReview(user_id, start, end) {
  const sql = `with rno_review as (
                select 
                  row_number() over(order by rv.register_date desc) as rno,
                  rv.review_id,
                  rv.review_content,
                  rv.review_img,
                  rv.review_star,
                  rv.register_date,
                  date_format(rv.checkin, '%Y-%m-%d') as checkin,
                  date_format(rv.checkout, '%Y-%m-%d') as checkout,
                  rv.room_id,
                  rv.user_id,
                  rm.room_name,
                  ac.acc_name,
                  us.user_name
                from review rv, room rm, accommodation ac, user us
                where rv.room_id = rm.room_id
                and rm.acc_id = ac.acc_id
                and rv.user_id = us.user_id
                and rv.user_id = ?
              )
              
              select 
                rno,
                review_id,
                review_content,
                review_img,
                review_star,
                register_date,
                checkin,
                checkout,
                room_id,
                user_id,
                room_name,
                acc_name,
                user_name,
                (select count(*) from rno_review) as total_cnt
              from rno_review
              where rno between ? and ?`;

  return db
  .execute(sql, [user_id, start, end])
  .then(result => result[0]);
}

/**
 * getReview : 해당하는 리뷰 리스트 조회
 * @param {*} reviewid 
 * @returns row 데이터
 */
export async function getReview(review_id) {
  const sql = `select 
                  review_id, 
                  room_id,
                  user_id, 
                  review_content, 
                  review_img, 
                  review_star, 
                  register_date, 
                  date_format(checkin, '%Y-%m-%d') as checkin,
                  date_format(checkout, '%Y-%m-%d') as checkout
                from review
                where review_id = ?`;

  return db
  .execute(sql, [review_id])
  .then(result => result[0][0]);
}

/**
 * isUserReview : 현재 존재하는 회원이면서 해당하는 회원이 작성한 리뷰의 count
 * @param {*} user_id 
 * @param {*} review_id 
 * @returns cnt 데이터
 */
export async function isUserReview(user_id, review_id) {
  const sql = `select count(*) as cnt
                from user us, review rv
                  where us.user_id = rv.user_id
                  and us.user_id = ?
                  and rv.review_id = ?`;

  return db
  .execute(sql, [user_id, review_id])
  .then(result => result[0][0].cnt);
}

/**
 * removeReview : 회원이 등록한 리뷰 삭제
 * @param {*} user_id 
 * @param {*} review_id 
 * @returns 
 */
export async function removeReview(user_id, review_id) {
  return db
  .execute(`delete from review where review_id = ? and user_id = ?`, [review_id, user_id])
  .then(result => 'delete ok')
}

export async function getUpcomingReservation(user_id) {
  return db
  .execute(`select count(*) as cnt from reservation where user_id=? and curdate() <= left(checkin,10)`,[user_id])
  .then(result => result[0][0].cnt)
  .catch(err => console.log(err))
}


export async function editPassword(user_id, pw) {
  return db
  .execute(`update user set user_passwd=? where user_id=?`,[pw, user_id])
  .then(result => 'pw edit success')
  .catch(err => console.log(err))
}

export async function editUserInfo(user_id,user_name,user_email,phone,user_img) { // 
  return db
  .execute(`update user set user_name=?, user_email=?, user_phone=? ,user_img=? where user_id=?`,
  [user_name,user_email,phone,user_img,user_id])
  .then(result => 'ok')
  .catch(err => console.log(err))
}

export async function quitMember(user_id) {
  return db
  .execute(`delete from user where user_id=?`, [user_id])
  .then(result => 'ok')
  .catch(err => console.log(err))
}

export async function postQuestion(params) {
  return db
  .execute(`insert into question(user_id,question_category, question_title, question_content,update_date)
            values(?,?,?,?,sysdate())`, params)
  .then(result => 'ok')
  .catch(err => console.log(err))
}

export async function updateQuestion(params) {
  return db
  .execute(`update question set question_category=?, question_title=?, question_content=?, update_date=sysdate()
            where question_id=?`,params)
  .then(result => 'ok')
  .catch(err => console.log(err))
}

export async function deleteQuestion(question_id) {
  return db
  .execute(`delete from question where question_id=?`,[question_id])
  .then(result => 'ok')
  .catch(err => console.log(err))
}

export async function getQuestion(question_id) {
  return db
  .execute(`select user_id, question_category, question_title, question_content, 
            left(q.update_date,10) as question_date, answer_id, answer_content, left(a.update_date,10) as answer_date
            from question q left outer join answer a on q.question_id = a.question_id
            where q.question_id=?`,[question_id])
  .then(result => result[0][0])
  .catch(err => console.log(err))
}

export async function getQuestions(user_id) {
  return db
  .execute(`select row_number() over(order by q.update_date desc) as rno, q.question_id, question_category, question_title, question_content, 
                   left(q.update_date,10) as update_date, if(a.question_id is not null, 1, 0) as answer_state from 
                   question q left outer join answer a on q.question_id = a.question_id
                   where q.user_id=? order by q.update_date desc`, [user_id])
  .then(result => result[0])
  .catch(err => console.log(err))
}

export async function getCoupons(user_id) {
  return db
  .execute(`select coupon_id, coupon_name, discount_price 
            from coupon where user_id=?`,[user_id])
  .then(result => result[0])
  .catch(err => console.log(err))
}


export async function getLoveStay(user_id) {
  return db
  .execute(`select love_id, ac.acc_id, acc_name, min_capa, max_capa, room_price, area_code from acc_love lv 
            inner join 
            (select acc_name, ac.acc_id, min(min_capa) as min_capa, max(max_capa) as max_capa,
            min(room_price) as room_price, area_code
            from accommodation ac inner join room rm 
            on ac.acc_id=rm.acc_id group by ac.acc_id) ac
            on lv.acc_id = ac.acc_id
            where lv.user_id=? order by love_id desc`,[user_id])
  .then(result => result[0])
  .catch(err => console.log(err))
}
