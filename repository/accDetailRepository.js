// accDetailRepository.js

import {db} from '../db/database.js';

export async function getAccInfo(accid) {
  const sql = `select acc_name, left(address,2) as address, acc_img from accommodation a  
  inner join acc_img 
  on a.acc_id  = acc_img.acc_id 
  where acc_img.acc_id = ? and acc_img.acc_img_type = 2`
  return db
  .execute(sql, [accid])
  .then(rows => rows[0][0])
}

export async function getRoomInfo(accid){
  const sql = `SELECT room_name, room_price, min_capa, max_capa, room_img1, room_id FROM room
  WHERE acc_id = ?`
  return db
  .execute(sql, [accid])
  .then(rows => rows[0])
}

export async function getSummary(accid){
  const sql = `select acc_name, acc_summary1, acc_summary2 from accommodation where acc_id =?`
  return db
  .execute(sql,[accid])
  .then(rows => rows[0][0])
}

export async function getAccPoint(accid){
  const sql = `select acc_img from acc_img where acc_img.acc_id = ? and acc_img.acc_img_type = 2`
  return db
  .execute(sql,[accid])
  .then(rows => rows[0][0])
}


export async function getMap(accid){
  const sql =`select acc_name, tel, address, latitude, longitude, homepage from accommodation where acc_id = ?`
  return db
  .execute(sql,[accid])
  .then(rows=>rows[0][0])
}
