import {db} from '../db/database.js'

export async function getAccInfo(acc_id) {
  return db
  .execute(`select acc_id, acc_name, tel, zipcode, address, latitude, longitude,
            parking, cook, pet, breakfast, acc_checkin, acc_checkout, homepage,
            register_date, love, only, area_code, acc_summary1, acc_summary2
            from accommodation where acc_id=?`,[acc_id])
  .then(result => result[0][0])
  .catch(err => console.log(err))
}

export async function getAccImages(acc_id) {
  return db
  .execute(`select acc_img, if(acc_img_type=1, 'small', 'big') as img_size from acc_img 
            where acc_id=?`,[acc_id])
  .then(result => result[0])
  .catch(err => console.log(err))
}