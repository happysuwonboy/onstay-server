import { db } from '../db/database.js';

/**
 * NewStaySection
 * @returns 3개월 이내 등록된 숙소 데이터와 이미지
 */
export async function getList() {
  const sql = `
  select acc.acc_id, 
  acc.acc_name, 
  acc.register_date, 
  acc.area_code,
  acc.acc_summary1,
  acc_img.acc_img
  from accommodation acc, 
  acc_img_view acc_img
  where acc.acc_id = acc_img.acc_id
  and register_date between date_add(now(), interval -3 month) and now()`;
  return db
    .execute(sql)
    .then(row => row[0])
};

/**
 * NewAccContent
 * @returns 3개월 이내 등록된 숙소 데이터와 객실 데이터, datediff 값 응답
 */
export async function getAccList() {
  const sql = `
  select acc.acc_id, 
  acc.acc_name,
  acc.register_date, 
  room.min_capa, 
  room.max_capa, 
  datediff(curdate(), 
  acc.register_date) as day_diff
  from accommodation acc, room
  where acc.acc_id = room.acc_id
  and register_date between date_add(now(), interval -3 month) and now()
  and room_name = '안채';`
  return db
    .execute(sql)
    .then(row => row[0])
}