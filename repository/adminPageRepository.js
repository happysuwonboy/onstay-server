import {db} from '../db/database.js';

/* 숙소 리스트 조회 */
export async function getAccList({startIndex, endIndex}) {
    const sql = ` SELECT 
                    acc_id, acc_name, register_date, area_code, room_name, room_price, room_img1, total_count
                FROM (
                    SELECT 
                    row_number() over (order by register_date desc) as no,
                    acc.acc_id,
                    acc.acc_name, 
                    LEFT(acc.register_date,10) as register_date,
                    acc.area_code,
                    rm.room_name, 
                    FORMAT(rm.room_price,0) as room_price, 
                    rm.room_img1,
                    COUNT(*) OVER () AS total_count
                FROM 
                    accommodation acc, room rm
                WHERE acc.acc_id = rm.acc_id
                )  as accs
                where no between ${startIndex} and ${endIndex};
                `;
    return db
    .execute(sql)
    .then((rows) => rows[0]);
}

/* 상세 정보 조회 */
export async function detailAcc({accId,roomName}) {
    const sql = `SELECT 
                *
                FROM
                    accommodation ac, room rm, acc_img acc_img
                WHERE
                    ac.acc_id = rm.acc_id
                AND ac.acc_id = acc_img.acc_id
                AND ac.acc_id = '${accId}'
                AND rm.room_name = '${roomName}';
                `;
    return db
    .execute(sql)
    .then((rows) => rows[0]);
}

/* 숙소, 객실 등록 */
export async function insertAcc({accName, tel, zipcode, address, latitude, longitude, parking, cook, pet, breakfast, accCheckin, accCheckout, homepage, registerDate, only, areaCode, accSummary1, accSummary2}) {
    const sql = ` 
                INSERT INTO accommodation
                    (acc_name, tel, zipcode, address, latitude, longitude, parking, cook, pet, breakfast, acc_checkin, acc_checkout, homepage, register_date, only, area_code, acc_summary1, acc_summary2)
                VALUES
                    ('${accName}', '${tel}', '${zipcode}', '${address}', '${latitude}', '${longitude}', '${parking}', '${cook}', '${pet}', '${breakfast}', '${accCheckin}', '${accCheckout}', '${homepage}', '${registerDate}', '${only}', '${areaCode}', '${accSummary1}', '${accSummary2}');
                `;
    return db
    .execute(sql)
    .then((result) => 'ok');
}
export async function insertRoom({roomName, roomPrice, featureCodes, amenities, minCapa, maxCapa, roomImg1, roomImg2, roomImg3}) {
    const sql = ` 
                INSERT INTO room
                    (acc_id,room_name, room_price, feature_codes, amenities, min_capa, max_capa, room_img1, room_img2, room_img3)
                VALUES
                    ((SELECT acc_id FROM accommodation ORDER BY acc_id DESC LIMIT 1),'${roomName}','${roomPrice}','${featureCodes}','${amenities}','${minCapa}','${maxCapa}','${roomImg1}','${roomImg2}','${roomImg3}');
                `;
    return db
    .execute(sql)
    .then((result) => 'ok');
}
export async function insertAccImgs({accImg1}) {
    const sql = ` 
                INSERT INTO acc_img
                    (acc_id, acc_img, acc_img_type)
                VALUES
                    ((SELECT acc_id FROM accommodation ORDER BY acc_id DESC LIMIT 1), '${accImg1}', 1);
                `;
    return db
    .execute(sql)
    .then((result) => 'ok');
}
/* 숙소, 객실 삭제 */
export async function countRoomPerAcc({accId}){
    const sql = `SELECT COUNT(*) as count FROM room WHERE acc_id = '${accId}'`;
    return db
    .execute(sql)
    .then((rows) => rows[0][0].count);
}
export async function deleteAcc({accId}) {
    const sql = `DELETE FROM accommodation WHERE acc_id = '${accId}'`;
    return db
    .execute(sql)
    .then((result) => 'ok');
}
export async function deleteRoom({roomName}) {
    const sql = `DELETE FROM room WHERE room_name = '${roomName}'`;
    return db
    .execute(sql)
    .then((result) => 'ok');
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
              q.question_id, question_category, question_title, a.answer_id, a.answer_content,
              question_content, q.user_id, if(a.question_id is not null, 1, 0) as answer_state,
              left(q.update_date,10) as question_update_date, left(a.update_date,10) as answer_update_date
              from question q left outer join answer a on q.question_id = a.question_id
              where if(a.question_id is not null, 1, 0) = ? 
              order by ${answerState ? 'a' : 'q'}.update_date desc`,[answerState])
    .then(result => result[0])
    .catch(err => console.log(err))
}

export async function postAnswer(question_id, answer_content) {
    return db
    .execute(`insert into answer(question_id, answer_content, update_date) 
            values(?,?,sysdate())`, [question_id, answer_content])
    .then(result => 'ok')
    .catch(err => console.log(err))
}

export async function updateAnswer(answer_id, answer_content) {
    return db
    .execute(`update answer set answer_content=? where answer_id=?`,[answer_content,answer_id])
    .then(result => 'ok')
    .catch(err => console.log(err))
}

export async function removeAnswer(question_id) {
    return db
    .execute(`delete from answer where question_id=?`,[question_id])
    .then(result => 'ok')
    .catch(err => console.log(err))
}