import {db} from '../db/database.js';

/* 전체 숙소 리스트 조회 */
export async function getAccList({ searched, location, checkin, checkout,  personnel, minPrice, maxPrice, isParking, isCook, isPet, isBreakfast, sort }) {
    let filteredSort='';
    if(sort==='latest'){
        filteredSort = 'register_date desc';
    }else if(sort==='highPrice'){
        filteredSort='MIN(rm.room_price) desc';
    }else if(sort==='lowPrice'){
        filteredSort='MIN(rm.room_price) asc';
    }else{
        filteredSort='love desc';
    }

    const sql = `
            SELECT 
            *
            FROM (
                SELECT 
                    row_number() over (order by ${filteredSort}) as no,
                    acc.acc_id, 
                    acc.acc_name, 
                    acc.parking, 
                    acc.cook, 
                    acc.pet, 
                    acc.breakfast, 
                    acc.love, 
                    acc.area_code, 
                    acc.register_date,
                    MIN(rm.room_price) AS room_price,
                    MIN(rm.min_capa) AS min_capa,
                    MAX(rm.max_capa) AS max_capa,
                    GROUP_CONCAT(DISTINCT acc_img.acc_img) AS acc_img
                FROM 
                    accommodation acc, acc_img acc_img, room rm
                WHERE acc.acc_id = acc_img.acc_id
                AND acc.acc_id = rm.acc_id
                AND acc.acc_name LIKE '%${searched}%'
                ${location==='전체' ? '' : `AND acc.area_code='${location}'`}
                ${(checkin !== undefined && checkout !== undefined) ? 
                    `AND acc.acc_id NOT IN (
                        SELECT rm.acc_id
                        FROM room rm, reservation res
                        WHERE rm.room_id = res.room_id
                        AND (
                            ('${checkin}' < res.checkin AND '${checkout}' > res.checkin)
                            OR ('${checkin}' = res.checkin AND '${checkout}' >= res.checkin)
                            OR ('${checkin}' > res.checkin AND '${checkin}' < res.checkout)
                        )
                    )` : ''
                }
                ${personnel ? `AND ${personnel} <= rm.max_capa` : ''}
                ${minPrice && maxPrice ? `AND room_price BETWEEN ${minPrice} AND ${maxPrice}` : ''}
                ${isParking==='0' ? `AND (acc.parking=0 OR acc.parking=1)` : `AND acc.parking=1`}
                ${isCook==='0' ? `AND (acc.cook=0 OR acc.cook=1)` : `AND acc.cook=1`}
                ${isPet==='0' ? `AND (acc.pet=0 OR acc.pet=1)` : `AND acc.pet=1`}
                ${isBreakfast==='0' ? `AND (acc.breakfast=0 OR acc.breakfast=1)` : `AND acc.breakfast=1`}
                GROUP BY 
                    acc.acc_id, 
                    acc.acc_name, 
                    acc.parking, 
                    acc.cook, 
                    acc.pet, 
                    acc.breakfast, 
                    acc.love, 
                    acc.register_date,
                    acc.area_code
                ORDER BY
                    ${filteredSort}
    )  as acclist `;
    // WHERE no BETWEEN ${startIndex} AND ${endIndex}`;
    // console.log(startIndex, endIndex);

    return db
    .execute(sql)
    .then((rows) => rows[0]);
}

export async function getLoveAccList({ userId }){
    const sql = `select acc_id from acc_love where user_id = '${userId}';`;

    return db
    .execute(sql)
    .then((rows) => rows[0]);
}
export async function addLove({ userId, accId }){
    const sql = `insert into acc_love(user_id, acc_id) values('${userId}', '${accId}');`;
    console.log(userId, accId)
    return db
    .execute(sql)
    .then((result) => 'ok');
}

export async function removeLove({ userId, accId }){
    const sql = `delete from acc_love where user_id = '${userId}' and acc_id = '${accId}';`;

    return db
    .execute(sql)
    .then((result) => 'ok');
}

export async function addAccLove({ accId }){
    const sql = `update accommodation set love = love + 1 where acc_id = '${accId}';`;

    return db
    .execute(sql)
    .then((result) => 'ok');
}

