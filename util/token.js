import jwt from 'jsonwebtoken';

export const createAccessToken = (userInfo) => {
  return jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRETKEY, {expiresIn : '1h'})
}

export const createRefreshToken = (userInfo) => {
  return jwt.sign(userInfo, process.env.REFRESH_TOKEN_SECRETKEY, {expiresIn : '30 days'}) 
} 

export const removeAllToken = (res) => {
  res.cookie('auth_access_token', null, {maxAge:0})
  res.cookie('auth_refresh_token', null, {maxAge:0})
}