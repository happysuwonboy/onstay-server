import * as memberRepository from '../repository/memberRepository.js'
import bcrypt from 'bcrypt';
import { createAccessToken, createRefreshToken, removeAllToken } from '../util/token.js';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants/secureConstatns.js';
import jwt from 'jsonwebtoken';


export async function getUserInfo(req,res) {
  const user_id = req.params.user_id;
  const userInfo = await memberRepository.getUserInfo(user_id); // 패스워드 정보까지 다 받아옴
  
  let body;

  try {
    let {hashPw, ...rest} = userInfo; // 패스워드를 제외한 정보를 보내주도록 pw 프로퍼티를 걸러냄
    body = rest
  } catch {}

  res.status(200).send(body)
} 


export async function userIdDuplicationCheck(req, res) {
  const { user_id } = req.params;
  const result = await memberRepository.getUserInfo(user_id)
  res.status(200).send({ isUnique : !result ? true : false })
}

export async function userJoin(req, res) {
  let { user_id, user_pw, user_name, user_email, phone } = req.body
  // 패스워드 해싱 (암호화)
  let hashPw = bcrypt.hashSync(user_pw, 10)
  // 해싱한 패스워드를 담아 db에 insert 해줌
  const params = [user_id, hashPw, user_name, user_email, phone]

  let result = await memberRepository.userJoin(params);

  if (result === 'success') {
    res.status(201).end()
  } else {
    res.status(409).end()
  }
}

export async function userLogin(req, res) {
  let { user_id, user_pw } = req.body;
  const result = await memberRepository.getUserInfo(user_id);

  if (!result) return res.status(400).send('not exist') // 유저 존재하지 않을 경우 종료

  let { hashPw, user_name, user_role } = result
  const isPwSame = bcrypt.compareSync(user_pw, hashPw)

  if (!isPwSame) { // 패스워드 틀릴 경우 종료 
    return res.status(400).send('wrong pw') 
  } else { // 패스워드 일치할 경우
    const accessToken = createAccessToken({ user_id })
    const refreshToken = createRefreshToken({ user_id })
    await memberRepository.storeRefreshToken([user_id, refreshToken])
    res.cookie('auth_access_token', accessToken, {maxAge:1*60*60*1000}) // 1시간
    res.cookie('auth_refresh_token', refreshToken, {httpOnly:true, maxAge:30*24*60*60*1000}) // 30일
    res.status(201).json({userInfo : {user_id, user_name, isAdmin : user_role===1 ? true : false}})
  }
}


export async function userLogout(req,res) {
  const user_id = req.body.user_id;
  await memberRepository.storeRefreshToken([user_id, null])
  removeAllToken(res)
  res.status(204).send('ok')
}


// 액세스 토큰 및 리프레쉬 토큰 체크 컨트롤러
export async function tokenCheck(req, res) {
  const accessToken = req.cookies.auth_access_token;
  const refreshToken = req.cookies.auth_refresh_token;


  // 1. 액세스 토큰 만료 여부를 체크
  if (accessToken) {
    try {
      let user_id = jwt.verify(accessToken, ACCESS_TOKEN.secretKey).user_id;
      const userInfo = await memberRepository.getUserInfo(user_id);
      let {user_name, user_role} = userInfo;
      return res.status(200).send({userInfo : {user_id, user_name, isAdmin : user_role===1 ? true : false}}); // 액세스 토큰 만료되지 않은 경우 ok 보내주고 종료
    } catch {
      removeAllToken(res)
      return res.status(401).send('invalid token') // 이상한 형식이거나, 프로젝트의 시크릿키로 암호화되지 않았을 경우  종료
    }  
  }

  // 2.리프레쉬 토큰 만료 여부를 체크
  if (!refreshToken) {
    removeAllToken(res)
    return res.status(401).send('invalid token')
  }; // 리프레쉬 토큰 만료된 경우 종료


  // 3. 헤더로 넘어온 리프레쉬 토큰과 db의 리프레쉬 토큰의 일치 여부 확인
  let user_id;
  let isSame;
  try {
     user_id = jwt.verify(refreshToken,REFRESH_TOKEN.secretKey).user_id;
  } catch {
    removeAllToken(res)
    return res.status(401).send('invalid token') 
  }

  isSame = await memberRepository.checkRefreshToken(user_id, refreshToken);

  if (!isSame) {
    removeAllToken(res)
    return res.status(401).send('invalid token');
  } // 리프레쉬 토큰 검증 실패한 경우 종료

  // 4. 새로운 액세스 토큰 발급
  const newAccessToken = createAccessToken({user_id});
  const userInfo = await memberRepository.getUserInfo(user_id)
  let {user_name, user_role} = userInfo
  res.cookie('auth_access_token', newAccessToken, {maxAge:1*60*60*1000})
  res.status(200).send({userInfo : {user_id, user_name, isAdmin : user_role===1 ? true : false}})
}



