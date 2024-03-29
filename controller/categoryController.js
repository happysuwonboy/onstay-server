import * as categoryRepository from '../repository/categoryRepository.js';

/**
 * getAccOnly 
 * onstayhouse에서만 존재하는 숙소 리스트 12개 조회 (swiper)
 * label ( only, new 3개월 이내 boolean 타입 컬럼 )
 * @param {*} req 
 * @param {*} res 
 */
export async function getAccOnly(req, res) {
  const rows = await categoryRepository.getAccOnly();
  res.json(rows);
}

/**
 * getAccPrice
 * 20만원 이하의 가성비 숙소 리스트 12개 조회 (swiper)
 * label ( only, new 3개월 이내 boolean 타입 컬럼 추가 )
 * @param {*} req 
 * @param {*} res 
 */
export async function getAccPrice(req, res) {
  const rows = await categoryRepository.getAccPrice();
  res.json(rows);
}

/**
 * getAccImg : 숙소 조건에 따른 숙소당 이미지 한개 조회 (swiper)
 * @param {*} req 
 * @param {*} res 
 */
export async function getAccImg(req, res) {
  const id = req.params.id;
  const rows = await categoryRepository.getAccImg(id);
  res.json(rows);
}
