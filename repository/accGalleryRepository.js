import {db} from '../db/database.js';

export async function getGalleryTop(accid) {
  const sql = `select acc_name, left(address,2) as address, acc_img from accommodation 
  inner join acc_img 
  on accommodation.acc_id  = acc_img.acc_id 
  where acc_img.acc_id = ? and acc_img.acc_img_type = 2`
  return db
  .execute(sql, [accid])
  .then(rows => rows[0][0])
}

export async function getGalleryMiddle(accid) {
  const sql = `select acc_img from accommodation 
  inner join acc_img 
  on accommodation.acc_id  = acc_img.acc_id 
  where acc_img.acc_id = ? and acc_img.acc_img_type = 1`
  return db
  .execute(sql, [accid])
  .then(rows => rows[0])
}

export async function getGalleryBottom(accid) {
  const sql = `select room_name, room_img1, room_img2, room_img3 from room
  where acc_id = ?`
  return db
  .execute(sql, [accid])
  .then(rows => rows[0])
}