import * as newStayRepostory from '../repository/newStayRepository.js';

/**
 * NewStaySection
 * @param {*} req 
 * @param {*} res 
 */
export async function getList(req, res) {
  const result = await newStayRepostory.getList();
  res.json(result);
};

/**
 * NewAccContent
 * @param {*} req 
 * @param {*} res 
 */
export async function getAccList(req, res) {
  const { page, pageItem } = req.body;
  const startIndex = (page - 1) * pageItem + 1;
  const endIndex = startIndex + 1;
  const result = await newStayRepostory.getAccList({ startIndex, endIndex });
  res.json(result);
}