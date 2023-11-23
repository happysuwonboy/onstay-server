import * as accRepository from '../repository/accRepository.js'

export async function getAccommodation(req,res) {
  let acc_id = req.params.acc_id;
  const acc_info = await accRepository.getAccInfo(acc_id);
  const acc_images = await accRepository.getAccImages(acc_id);
  res.status(200).send({acc_info, acc_images})
}