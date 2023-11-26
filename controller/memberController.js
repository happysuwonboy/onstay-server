import * as memberRepository from '../repository/memberRepository.js'

export async function userIdDuplicationCheck(req,res) {
  const {user_id} = req.params;
  const isUnique = await memberRepository.userIdDuplicationCheck(user_id)
  res.status(200).send({isUnique})
}

export async function userJoin(req,res) {
  console.log(req.body);
}