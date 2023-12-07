import { db } from '../db/database.js';


export async function getUserReservation(user_id) {
  return db
    .execute(`select reservation_id, acc_name, rm.acc_id, room_name,
                pay_date, checkin, checkout, room_price,
                acc_checkin checkin_time, acc_checkout checkout_time
              from reservation rs inner join room rm inner join accommodation ac
              on rs.room_id = rm.room_id and rm.acc_id = ac.acc_id
               where user_id = ? order by checkin asc`, [user_id])
    .then(result => result[0].length ? result[0] : 'no result')
    .catch(err => console.log(err))
}

export async function getUpcomingReservations(user_id, filter='') {
  return db
  .execute(`select reservation_id, ac.acc_id, room_name, left(pay_date,10) pay_date,
            left(checkin,10) checkin_date, left(checkout,10) checkout_date, room_price,
            acc_checkin checkout_time, acc_checkout checkout_time,
            if(datediff(checkin,now()) <= 2, false, true) as isCancelable
            from reservation rs inner join room rm inner join accommodation ac
            on rs.room_id = rm.room_id and rm.acc_id = ac.acc_id
            where ${filter} user_id=?
            order by checkin_date desc`,[user_id])
  .then(result=>result[0])
}

export async function cancelReservation(reservation_id) {
  return db
  .execute(`delete from reservation where reservation_id=?`,[reservation_id])
  .then(result => 'ok')
  .catch(err => console.log(err))
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
  .execute(`select row_number() over() as rno, q.question_id, question_category, question_title, question_content, 
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
            where lv.user_id=?`,[user_id])
  .then(result => result[0])
  .catch(err => console.log(err))
}
