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
  const result = await newStayRepostory.getAccList();
  res.json(result);
}