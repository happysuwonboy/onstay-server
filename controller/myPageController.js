import * as myPageRepository from '../repository/myPageRepository.js';
import * as accRepository from '../repository/accRepository.js';
import * as memberRepository from '../repository/memberRepository.js';
import {removeAllToken} from '../util/token.js';
import bcrypt from 'bcrypt';


export async function getUserReservations(req,res) {
  const {user_id, category} = req.params;
  
  let filter;
  if (category==='upcoming') {
    filter = 'datediff(checkin,now()) >= 0 and'
  } else if (category==='complete') {
    filter = 'datediff(checkin,now()) < 0 and'
  } else { // 모든 예약내역 
    filter=''
  }

  const rows = await myPageRepository.getUserReservations(user_id, filter);

  if (!rows.length) return res.status(200).send([])

  const body = [];
  for (const row of rows) {
    const images = await accRepository.getAccImages(row.acc_id);
    body.push({...row, images})
  }

  res.status(200).send(body)
}


export async function cancelReservation(req,res) {
  let reservation_id = req.body.reservation_id;

  let result = await myPageRepository.cancelReservation(reservation_id);

  if (result==='ok') {
    res.status(204).send({message : 'cancel success'})
  } else {
    res.status(500).send({message : '서버 에러가 발생하여 예약 취소에 실패하였습니다.'})
  }
}

/**
 * getAllReview : 해당하는 회원의 작성한 리뷰 리스트 조회
 * @param {*} req 
 * @param {*} res 
 */
export async function getAllReview(req, res) {
  const {user_id, currentPage} = req.params;
  const end = 2 * currentPage;
  const start = (end - 1);
  const rows = await myPageRepository.getAllReview(user_id, start, end);
  res.json(rows);
}

/**
 * getReview : 해당하는 리뷰 리스트 조회
 * @param {*} req 
 * @param {*} res 
 */
export async function getReview(req, res) {
  const review_id = req.params.reviewid;
  const row = await myPageRepository.getReview(review_id);
  res.json(row);
}

/**
 * removeReview : 회원, 리뷰 확인 후 리뷰 삭제
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export async function removeReview(req, res) {
  const {user_id, review_id} = req.body;
  try {
    // 존재하는 회원 + 작성한 리뷰가 있는지 확인
    const isUserReviewResult = await myPageRepository.isUserReview(user_id, review_id);

    // 조회 결과 일치하는 회원이 아니거나 작성한 리뷰 x
    if(isUserReviewResult === 0) {
      return res.status(404).send({message : '리뷰, 회원이 존재하지 않습니다'})
    }

    const result = await myPageRepository.removeReview(user_id, review_id);
    if(result === 'delete ok') {
      res.json(result);
    } else {
      return res.status(200).send({message : '삭제에 실패하였습니다'})
    }

  } catch(error) {
    res.status(500).send({message : '서버 오류', error: error.message})
  }
}

export async function editPassword(req,res) {
  const {user_id, current_pw, new_pw} = req.body;
  const userInfo = await memberRepository.getUserInfo(user_id)
  const isCurrentPwSame =  bcrypt.compareSync(current_pw,userInfo.hashPw);
  
  if (!isCurrentPwSame) return res.status(401).json({message : '입력한 비밀번호와 현재 비밀번호가 일치하지 않습니다.'})

  const newHashPw = bcrypt.hashSync(new_pw, 10) // 새로 입력받은 패스워드 암호화

  const result = await myPageRepository.editPassword(user_id, newHashPw)
  
  if (result === 'pw edit success') {
    res.status(201).send({message : '비밀번호가 성공적으로 변경되었습니다.'})
  } else {
    res.status(500).send({message : '서버 에러가 발생하였습니다.'})
  }

}

export async function editUserInfo(req,res) {
  let {user_id, user_email, user_name, phone, current_user_img, isProfileDefault} = req.body;
  let user_img =  req.file?.filename || current_user_img;

  if (isProfileDefault==='true') {
    user_img = null
  }

  const result = await myPageRepository.editUserInfo(user_id,user_name,user_email,phone,user_img)
  
  if (result==='ok') {
    res.status(201).send({message : '회원 정보가 정상적으로 수정되었습니다.'})
  } else {
    res.status(500).send({message : '서버 에러가 발생하여 회원 정보 수정에 실패해였습니다.'})
  }
}


export async function quitMember(req,res) {
  const user_id = req.body.user_id;

  const isReservationExist = await myPageRepository.getUpcomingReservation(user_id)

  if (isReservationExist) return res.status(422).send({message : '다가오는 예약이 있습니다. 예약을 취소한 뒤 탈퇴해주세요.'})

  const result = await myPageRepository.quitMember(user_id);

  if (result==='ok') {
    removeAllToken(res)
    return res.status(204).send({message : '회원 탈퇴되었습니다. 홈으로 이동합니다.'})
  } else {
    return res.status(500).send({message : '서버 에러가 발생하여 회원 탈퇴에 실패하였습니다.'})
  }
}


export async function postQuestion(req,res) {
  const params = Object.values(req.body);

  let result = await myPageRepository.postQuestion(params);
  
  if (result === 'ok') {
    res.status(201).send({message : '1:1 문의를 등록하였습니다. 최대한 빠르게 답변해드리겠습니다.'})
  } else {
    res.status(404).send({message : '에러가 발생하여 1:1 문의 등록에 실패하였습니다.'})
  }
}

export async function updateQuestion(req,res) {
  const {question_category, question_title, question_content, question_id} = req.body;
  const result = await myPageRepository.updateQuestion([question_category, question_title, question_content, question_id]);
  if (result === 'ok') {
    res.status(201).send({message : 'ok'})
  } else {
    res.status(404).send({message : '에러가 발생하여 1:1 문의 등록에 실패하였습니다.'})
  }
}

export async function deleteQuestion(req,res) {
  const question_id = req.body.question_id
  const result = await myPageRepository.deleteQuestion(question_id);
  if (result === 'ok') {
    res.status(204).send({message : 'ok'})
  } else {
    res.status(404).send({message : '에러가 발생하여 1:1 문의 등록에 실패하였습니다.'})
  }
}

export async function getQuestion(req,res) {
  const question_id = req.params.question_id;
  const question = await myPageRepository.getQuestion(question_id);
  res.status(200).send(question)
}

export async function getQuestions(req,res) {
  const user_id = req.params.user_id
  const rows = await myPageRepository.getQuestions(user_id);
  res.status(200).send(rows)
}



{/**쿠폰 */}

export async function getCoupons(req,res) {
  const user_id = req.params.user_id;
  const rows = await myPageRepository.getCoupons(user_id);
  res.status(200).send(rows)
} 


{/** 관심 스테이 */}

export async function getLoveStay(req,res) {
  const user_id = req.params.user_id;
  const rows = await myPageRepository.getLoveStay(user_id);

  if (!rows.length) return res.status(200).send([]);

  let data = []
  for (let row of rows) {
    let images = await accRepository.getAccImages(row.acc_id) 
    let rowWithImgs = {...row, images}
    data.push(rowWithImgs)
  }
  res.status(200).send(data);
}
