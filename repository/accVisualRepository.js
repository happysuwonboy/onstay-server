import {db} from '../db/database.js';

export async function getVisual(){
  const sql = `SELECT acc_img FROM acc_img where acc_img_type=2 ORDER BY RAND() LIMIT 5`
  return db
  .execute(sql, [])
  .then(rows => rows[0])
}