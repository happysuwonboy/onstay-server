import * as newStayRepostory from '../repository/newStayRepository.js';

export async function getList(req, res) {
  const result = await newStayRepostory.getList();
  res.json(result);
};