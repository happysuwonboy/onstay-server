import {db} from '../db/database.js';

/* 전체 숙소 리스트 조회 */
export async function getAccList({ personnel, minPrice, maxPrice, sort, checkin, checkout }) {
    const sql = `SELECT 
                    acc.acc_id, 
                    acc.acc_name, 
                    acc.parking, 
                    acc.cook, 
                    acc.pet, 
                    acc.breakfast, 
                    acc.love, 
                    acc.area_code, 
                    acc.register_date,
                    GROUP_CONCAT(DISTINCT acc_img.acc_img) AS acc_img,
                    MIN(format(rm.room_price,0)) AS room_price,
                    MIN(rm.min_capa) AS min_capa,
                    MAX(rm.max_capa) AS max_capa
                FROM 
                    accommodation acc, acc_img acc_img, room rm
                WHERE acc.acc_id = acc_img.acc_id
                AND acc.acc_id = rm.acc_id
                ${personnel ? `AND ${personnel} <= rm.max_capa` : ''}
                ${minPrice && maxPrice ? `AND room_price BETWEEN ${minPrice} AND ${maxPrice}` : ''}
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
                    ${sort==='latest'?'register_date desc'
                    : sort==='highPrice'?'room_price desc'
                    : sort==='lowPrice'?'room_price asc'
                    : 'love desc'};
                `;

    return db
    .execute(sql)
    .then((rows) => rows[0])
}