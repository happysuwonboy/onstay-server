import {db} from '../db/database.js';

/* 전체 숙소 리스트 조회 */
export async function getAccList({ personnel }) {
    const sql = `SELECT 
                    acc.acc_id, 
                    acc.acc_name, 
                    acc.parking, 
                    acc.cook, 
                    acc.pet, 
                    acc.breakfast, 
                    acc.love, 
                    acc.area_code, 
                    GROUP_CONCAT(DISTINCT acc_img.acc_img) AS acc_img,
                    MIN(format(rm.room_price,0)) AS room_price,
                    MIN(rm.min_capa) AS min_capa,
                    MAX(rm.max_capa) AS max_capa
                FROM 
                    accommodation acc, acc_img acc_img, room rm
                WHERE acc.acc_id = acc_img.acc_id
                AND acc.acc_id = rm.acc_id
                ${personnel ? `AND ${personnel} <= rm.max_capa` : ''}
                GROUP BY 
                    acc.acc_id, 
                    acc.acc_name, 
                    acc.parking, 
                    acc.cook, 
                    acc.pet, 
                    acc.breakfast, 
                    acc.love, 
                    acc.area_code;
                `;

    return db
    .execute(sql)
    .then((rows) => rows[0])
}