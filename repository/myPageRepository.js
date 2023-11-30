import { db } from '../db/database.js';


export async function getUserReservation(user_id) {
  return db
    .execute(`select reservation_id, acc_name, rm.acc_id, room_name,
            pay_date, checkin, checkout, room_price  
            from reservation rs inner join room rm inner join accommodation ac
            on rs.room_id = rm.room_id and rm.acc_id = ac.acc_id
            where user_id = ? order by checkin asc`, [user_id])
    .then(result => result[0].length ? result[0] : 'no result')
    .catch(err => console.log(err))
}