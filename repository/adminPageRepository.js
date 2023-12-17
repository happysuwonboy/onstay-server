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

export async function getAllQuestions(answerState) {
    return db
    .execute(`select row_number() over(order by ${answerState ? 'a' : 'q'}.update_date desc) as rno, 
              q.question_id, question_category, question_title, 
              question_content, q.user_id, if(a.question_id is not null, 1, 0) as answer_state,
              left(q.update_date,10) as question_update_date, left(a.update_date,10) as answer_update_date
              from question q left outer join answer a on q.question_id = a.question_id
              where if(a.question_id is not null, 1, 0) = ? 
              order by ${answerState ? 'a' : 'q'}.update_date desc`,[answerState])
    .then(result => result[0])
    .catch(err => console.log(err))
}