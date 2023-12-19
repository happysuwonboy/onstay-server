import * as accGalleryReopsitory from '../repository/accGalleryRepository.js';

export async function getGalleryTop(req, res) {
  const accid = req.params.accid;
  const result = await accGalleryReopsitory.getGalleryTop(accid);
  res.json(result);
}

export async function getGalleryMiddle(req, res) {
  const accid = req.params.accid;
  const result = await accGalleryReopsitory.getGalleryMiddle(accid);
  res.json(result);
}

export async function getGalleryBottom(req, res) {
  const accid = req.params.accid;
  const result = await accGalleryReopsitory.getGalleryBottom(accid);
  res.json(result);
}