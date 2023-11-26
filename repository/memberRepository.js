import {db} from '../db/database.js'

export async function userIdDuplicationCheck(user_id) {
  return db
  .execute('select if(count(*)=0, 1, 0) isUnique from user where user_id=?',[user_id])
  .then(result => result[0][0].isUnique)
  .catch(err => console.log(err))
} 

export async function userJoin(params) {

}