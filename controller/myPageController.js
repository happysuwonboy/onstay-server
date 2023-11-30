import * as myPageRepository from '../repository/myPageRepository.js';


export async function getUserReservation(req,res) {
  const user_id = req.params.user_id;
  const result = await myPageRepository.getUserReservation(user_id)
  if (result === 'no result') return res.status(400).send('no result')
  res.status(200).send({result})
}