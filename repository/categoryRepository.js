import {db} from '../db/database.js';

/**
 * getAccOnly 
 * onstayhouse에서만 존재하는 숙소 리스트 12개 조회 (swiper)
 * label ( only, new 3개월 이내 boolean 타입 컬럼 )
 * @param {string} type 
 * @returns rows 데이터
 */
export async function getAccOnly() {
    const sql = ` select 
                    result.acc_id,
                    result.acc_name,
                    result.isNew,
                    result.only,
                    result.room_price,
                    result.area_code
                  from
                    ( select row_number() over(order by ac.area_code) as number,
                              ac.acc_id, 
                              ac.acc_name,
                              ac.only, 
                              if(register_date between date_add(now(), interval -3 month) and now(), true, false) as isNew,
                              min(room_price) as room_price, 
                              area_code
                      from accommodation ac
                            inner join 
                            ( select acc_id, 
                                      min(room_id) as room_id, 
                                      min(room_price) as room_price 
                              from room 
                              group by acc_id ) as rm on ac.acc_id = rm.acc_id
                      where ac.only = true
                      group by ac.acc_id, ac.acc_name, ac.area_code, ac.only, rm.room_price
                      order by area_code ) as result
                  where result.number between 1 and 12`

  return db 
    .execute(sql)
    .then(result => result[0]);
}


/**
 * getAccPrice 
 * 20만원 이하의 가성비 숙소 리스트 12개 조회 (swiper)
 * label ( only, new 3개월 이내 boolean 타입 컬럼 추가 )
 * @param {string} type 
 * @returns rows 데이터
 */
export async function getAccPrice() {
  const sql = `select 
                result.acc_id, 
                result.acc_name, 
                result.isNew,
                result.only,
                result.room_price, 
                result.area_code
                from
                  ( select row_number() over(order by ac.area_code) as number,
                            ac.acc_id, 
                            ac.acc_name,
                            ac.only,
                            if(register_date between date_add(now(), interval -3 month) and now(), true, false) as isNew,
                            min(room_price) as room_price, 
                            area_code
                    from accommodation ac
                          inner join (
                                      select acc_id, 
                                              min(room_id) as room_id, min(room_price) as room_price 
                                      from room 
                                      group by acc_id ) as rm on ac.acc_id = rm.acc_id
                    where rm.room_price <= 200000
                    group by ac.acc_id, ac.acc_name, ac.area_code, ac.only, rm.room_price
                    order by room_price ) as result
                where result.number between 1 and 12`

  return db 
    .execute(sql)
    .then(result => result[0]);
}


/**
 * getAccImg : 숙소 조건에 따른 리스트 조회 (swiper)
 * @param {string} id 
 * @returns row 데이터
 */
export async function getAccImg(id) {
  const sql = `select acc_id, acc_img from acc_img_view where acc_id = ?`;
  
  return db 
    .execute(sql, [id])
    .then(result => result[0][0]);
}