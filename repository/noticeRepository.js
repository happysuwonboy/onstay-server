import { db } from '../db/database.js';

/**
 * 
 * @param {*} startIndex 행 시작 
 * @param {*} startIndex 행 끝
 * @param {*} searchTerm 검색어
 * @param {*} selectOption 검색 옵션
 * @param {*} startDate 검색 날짜 시작일
 * @param {*} endDate 검색 날짜 종료일
 * @returns 옵션과 검색어에 따른 필터링된 데이터 5개 반환
 */
export async function getNoticeList({ startIndex, endIndex, searchTerm, selectOption, startDate, endDate }) {
  let sql = `
  select 
  no, notice_id, notice_title, notice_content, notice_date, notice_views,
  (select count(*) from notice`
  if (selectOption === 'title' || startDate === null || endDate === null) {
    sql += ` where notice_title like ?) as total_rows
    from (
    select row_number() over (order by notice_date desc) as no,
      notice_id,
      notice_title,
      notice_content,
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
      date_format(notice_date, '%Y - %m - %d') as notice_date,
      notice_views
    from notice
    where notice_date between ? and ?`
  }
sql += `) as noticelist
where no between ? and ?`

const titleParams = [`%${searchTerm}%`, `%${searchTerm}%`, startIndex, endIndex]
const dateParams = [startDate, endDate, startDate, endDate, startIndex, endIndex]

const params = (selectOption === 'title' || startDate === null || endDate === null)
? titleParams : dateParams;

  return db
    .execute(sql, params)
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

export async function geDetailNotice(notice_id) {
  const sql = `
  select notice_title,
  notice_content,
  notice_img,
  notice_date,
  notice_views
  from notice
  where notice_id = ?`

  return db
  .execute(sql, [notice_id])
  .then(rows => rows[0][0])
}