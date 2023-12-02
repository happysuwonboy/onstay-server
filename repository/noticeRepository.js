import { db } from '../db/database.js';

/**
 * 공지사항 데이터
 * @param {*} pageItem 개 행
 * @param {*} offset 번째 행 부터
 * @param {*} searchTerm 검색어
 * @param {*} selectOption 검색 옵션
 * @returns 옵션과 검색어에 따른 필터링된 데이터 값 5개씩 반환
 */
export async function getNoticeList({ startIndex, endIndex, searchTerm, selectOption, startDate, endDate }) {
  let sql = `
  select 
  no, notice_id, notice_title, notice_content, notice_img, notice_date, notice_views,
  (select count(*) FROM notice`
  if (selectOption === 'title') {
    sql += ` where notice_title like ?) as total_rows
    from (
    select row_number() over (order by notice_date desc) as no,
      notice_id,
      notice_title,
      notice_content,
      notice_img,
      date_format(notice_date, '%Y - %m - %d') as notice_date,
      notice_views
    from notice
    where notice_title like ?`
  } else if (selectOption === 'date') {
    sql += ` where notice_date between ? and ?) as total_rows
    from (
    select row_number() over (order by notice_date desc) as no,
      notice_id,
      notice_title,
      notice_content,
      notice_img,
      date_format(notice_date, '%Y - %m - %d') as notice_date,
      notice_views
    from notice
    where notice_date between ? and ?`
  }
sql += `) as noticelist
where no between ? and ?`

const titleParams = [`%${searchTerm}%`, `%${searchTerm}%`, startIndex, endIndex]
const dateParams = [startDate, endDate, startDate, endDate, startIndex, endIndex]

  return db
    .execute(sql, selectOption === 'title' ? titleParams : dateParams)
    .then(rows => rows[0]);
};

/**
 * 공지사항 업데이트
 * @param {*} notice_id 각 공지사항별 프라이머리키
 * @returns 공지사항별 notice_views 업데이트
 */
export async function updateViewCount(notice_id) {
  const sql = `
  update notice 
  set notice_views = notice_views + 1 
  where notice_id = ?`

  return db
    .execute(sql, [notice_id])
    .then(result => 'ok')
};