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
                    acc.register_date,
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
/* 숙소 등록 */
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
export async function insertRoom({roomName, roomPrice, featureCodes, amenities, minCapa, maxCapa, imageFile}) {
    const sql = ` 
                INSERT INTO room
                    (acc_id,room_name, room_price, feature_codes, amenities, min_capa, max_capa, room_img1)
                VALUES
                    ((SELECT acc_id FROM accommodation ORDER BY acc_id DESC LIMIT 1),'${roomName}','${roomPrice}','${featureCodes}','${amenities}','${minCapa}','${maxCapa}','${imageFile}');
                `;
    return db
    .execute(sql)
    .then((result) => 'ok');
}