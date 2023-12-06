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

/**
 * noticeDetail
 * @param {*} req notice_id
 * @param {*} res 각 공지사항별 데이터
 */
export async function geDetailNotice(req, res) {
  const notice_id = req.params.noticeid;
  const result = await noticeRepository.geDetailNotice(notice_id);
  res.json(result);
};

/**
 * NoticeAdd
 * @param {*} req 공지사항 title, content, imagefile
 * @param {*} res 'ok'
 */
export async function insertNotice(req, res) {
  const { title, content } = req.body;
  const imageFile = req.file.originalname;
  const result = await noticeRepository.insertNotice({title, content, imageFile});
  res.json(result);
};

/**
 * NoticeDelete
 * @param {*} req 체크된 공지사항
 * @param {*} res 'ok'
 */
export async function deleteNotice(req, res) {
  const { checkedItems } = req.body;
  console.log(checkedItems);
  const result = await noticeRepository.deleteNotice(checkedItems);
  res.json(result);
}