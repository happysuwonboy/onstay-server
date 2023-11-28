import {db} from '../db/database.js'

export async function userIdDuplicationCheck(user_id) {
  return db
  .execute('select if(count(*)=0, 1, 0) isUnique from user where user_id=?',[user_id])
  .then(result => result[0][0].isUnique)
  .catch(err => console.log(err))
} 

export async function userJoin(params) {
  return db
  .execute(`insert into user(user_id, user_passwd, user_name, user_email, user_phone, join_date, user_role)
                        values(?,?,?,?,?,curdate(),0)`,params)
  .then(result => 'success')
  .catch(err => {
    console.log(err)
    return 'fail'
  })
}

export async function userLogin(user_id) {
  return db
  .execute(`select user_passwd as hashPw, user_name from user
            where user_id=?`, [user_id])
  .then(result => result[0][0] || 'not exist')
  .catch(console.error)
}


export async function storeRefreshToken(params) { // user_id, refresh_token 을 담은 배열
  return db
  .execute(`insert into user_token(user_id, refresh_token) values (?,?)
            on duplicate key update user_id=?, refresh_token=?`, [...params,...params])
  .then(res => 'ok')
  .catch(err => console.log(err))
}

export async function checkRefreshToken(user_id,refreshToken) {
  return db
  .execute('select if(refresh_token=?,1,0) as isSame from user_token where user_id=?',[refreshToken,user_id])
  .then(result=>result[0][0]?.isSame)
  .catch(err=>{console.log(err)})
}