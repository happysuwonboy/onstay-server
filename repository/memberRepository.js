import {db} from '../db/database.js'

export async function getUserInfo(user_id) {
  return db
  .execute(`select user_passwd as hashPw, user_name, user_email, user_phone, 
                  user_img, join_date, user_role 
                  from user where user_id=?`, [user_id])
  .then(result => result[0][0])
  .catch(console.error)
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

export async function addCoupon(user_id, coupon_name, discount_price) {
  return db
  .execute(`insert into coupon(user_id,coupon_name,discount_price) values(?,?,?)`, [user_id, coupon_name, discount_price])
  .then(result => 'ok')
  .catch(err => console.log(err))
}


export async function checkRefreshToken(user_id,refreshToken) {
  return db
  .execute('select if(refresh_token=?,1,0) as isSame from user_token where user_id=?',[refreshToken,user_id])
  .then(result=>result[0][0]?.isSame)
  .catch(err=>{console.log(err)})
}

export async function storeRefreshToken(params) { // user_id, refresh_token 을 담은 배열
  return db
  .execute(`insert into user_token(user_id, refresh_token, pwreset_token) values (?,?,null)
            on duplicate key update user_id=?, refresh_token=?`, [...params,...params])
  .then(res => 'ok')
  .catch(err => console.log(err))
}



{/** 아이디 찾기, 비밀번호 찾기 */}

export async function findIdByEmail(user_email) {
  return db
  .execute(`select user_id, user_name, left(join_date,10) join_date
            from user where user_email=?`,[user_email])
  .then(result => result[0])
  .catch(err => console.log(err))
}

export async function storePwResetToken(params) {
  return db
  .execute(`insert into user_token(user_id, refresh_token, pwreset_token) values (?,null,?)
            on duplicate key update user_id=?, pwreset_token=?`, [...params,...params])
  .then(res => 'ok')
  .catch(err=> console.log(err))
}

export async function comparePwResetToken(token, user_id) {
  return db
  .execute(`select if(pwreset_token='${token}', true, false) as isSame from user_token where user_id=?`, [user_id])
  .then(result => result[0][0]?.isSame)
  .catch(err => console.log(err))
}

export async function removePwResetToken(token) {
  return db
  .execute(`update user_token set pwreset_token = null where pwreset_token=?`,[token])
  .then(result => 'ok')
  .catch(err => console.log(err))
}

export async function setAuth(user_id, user_role) {
  return db
  .execute(`update user set user_role=? where user_id=?`, [user_role, user_id])
  .then(result => 'ok')
  .catch(err => console.log(err))
}