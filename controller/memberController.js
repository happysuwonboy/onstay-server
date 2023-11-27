import * as memberRepository from '../repository/memberRepository.js'
import bcrypt from 'bcrypt';
import { createAccessToken, createRefreshToken } from '../util/token.js';

export async function userIdDuplicationCheck(req, res) {
  const { user_id } = req.params;
  const isUnique = await memberRepository.userIdDuplicationCheck(user_id)
  res.status(200).send({ isUnique })
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
  const result = await memberRepository.userLogin(user_id);

  if (result === 'not exist') return res.status(403).send(result) // 유저 존재하지 않을 경우 종료

  let { hashPw, user_name } = result
  const isPwSame = bcrypt.compareSync(user_pw, hashPw)

  if (!isPwSame) { // 패스워드 틀릴 경우 종료 
    return res.status(403).send('wrong pw') 
  } else { // 패스워드 일치할 경우
    const accessToken = createAccessToken({ user_id, user_name }) // 이건 json으로 보내줘
    const refreshToken = createRefreshToken({ user_id })
    res.cookie('auth_refresh_token', refreshToken, {
       httpOnly : true,
       maxAge : 7 * 24 * 60 * 60 * 1000
    })
    res.status(201).json({accessToken})
  }
}



