import * as myPageRepository from '../repository/myPageRepository.js';
import * as accRepository from '../repository/accRepository.js';


export async function getUserReservation(req,res) {
  const user_id = req.params.user_id;
  const reservsations = await myPageRepository.getUserReservation(user_id);

  if (reservsations === 'no result') return res.status(200).send([])

  const result = [];
  
  for (const reservation of reservsations) {
    const images = await accRepository.getAccImages(reservation.acc_id);
    result.push({...reservation, images})
  }

  res.status(200).send(result)
}