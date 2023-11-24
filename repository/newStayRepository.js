import { db } from '../db/database.js';

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