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