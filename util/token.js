import jwt from 'jsonwebtoken';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants/secureConstatns.js';

export const createAccessToken = (userInfo) => {
  return jwt.sign(userInfo, ACCESS_TOKEN.secretKey, ACCESS_TOKEN.config)
}

export const createRefreshToken = (userInfo) => {
  return jwt.sign(userInfo, REFRESH_TOKEN.secretKey, REFRESH_TOKEN.config) 
} 