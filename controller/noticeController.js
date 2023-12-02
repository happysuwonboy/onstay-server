import * as noticeRepository from '../repository/noticeRepository.js';

/**
 * Notice
 * @param {*} req page, pageItem, searchTerm, selectOption
 * @param {*} res 옵션과 검색어에 따른 필터링된 데이터 값 5개씩 반환
 */
export async function getNoticeList(req, res) {
  const { page, pageItem, searchTerm, selectOption, startDate, endDate } = req.body;
  const startIndex = (page - 1) * pageItem + 1;
  const endIndex = startIndex + 4
  const result = await noticeRepository.getNoticeList({ startIndex, endIndex, searchTerm, selectOption, startDate, endDate });
  res.json(result);
};

/**
 * notice_views Update
 * @param {*} req notice_id 
 * @param {*} res 'ok'
 */
export async function updateViewCount(req, res) {
  const notice_id = req.params.noticeId;
  const result = await noticeRepository.updateViewCount(notice_id);
  res.json(result);
};