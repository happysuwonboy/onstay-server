import {db} from '../db/database.js';

/* 숙소 리스트 조회 */
export async function getAccList() {
    const sql = `SELECT 
                    acc.acc_name, 
                    acc.register_date,
                    acc.area_code,
                    rm.room_name, 
                    FORMAT(rm.room_price,0) as room_price, 
                    rm.room_img1
                FROM 
                    accommodation acc, room rm
                WHERE acc.acc_id = rm.acc_id;
                `;
    
                // `
                // SELECT *
                // FROM (
                //     SELECT acc.acc_name, rm.room_name, rm.room_price,  acc_img.acc_img,
                //         ROW_NUMBER() OVER (PARTITION BY rm.room_id) as row_num
                //     FROM 
                //         accommodation acc, room rm
                //     WHERE room rm ON acc.acc_id = rm.acc_id
                // ) AS accs
                // WHERE row_num = 1;
                // `;
    return db
    .execute(sql)
    .then((rows) => rows[0]);
}


export async function getAllUsers() {
    return db
    .execute(`select user_id, user_name, user_email, user_phone, user_img, 
             left(join_date, 10) as join_date from user where user_role=0`)
    .then(result => result[0])
    .catch(err => console.log(err))
}