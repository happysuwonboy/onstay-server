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
  no, notice_id, notice_title, notice_content, notice_date, notice_views, notice_img,
  (select count(*) from notice`
  if (selectOption === 'title' || startDate === null || endDate === null) {
    sql += ` where notice_title like ?) as total_rows
    from (
    select row_number() over (order by notice_date desc) as no,
      notice_id,
      notice_title,
      notice_content,
      date_format(notice_date, '%Y - %m - %d') as notice_date,
      notice_views,
      notice_img
    from notice
    where notice_title like ?`
  } else if (selectOption === 'date') {
    sql += ` where notice_date between date_add(?, interval 1 day) and date_add(?, interval 1 day)) as total_rows
    from (
    select row_number() over (order by notice_date desc) as no,
      notice_id,
      notice_title,
      notice_content,
      date_format(notice_date, '%Y - %m - %d') as notice_date,
      notice_views,
      notice_img
    from notice
    where notice_date between date_add(?, interval 1 day) and date_add(?, interval 1 day)`
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

/**
 * NoticeDeatil
 * @param {*} notice_id 
 * @returns 각 공지사항별 데이터 반환
 */
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

/**
 * NoticeAdd
 * @returns insert 작업이 완료되면 'ok'
 */
export async function insertNotice({ title, content, imageFile }) {
  const sql = `
  insert notice(notice_title, 
    notice_content, 
    notice_img, 
    notice_date, 
    notice_views)
  values (?, ? , ?, sysdate(), 0 )`

  return db
    .execute(sql, [title, content, imageFile])
    .then(result => 'ok')
};

/**
 * NoticeDelete
 * @param {*} checkedItems 체크된 공지사항 아이디
 * @returns 체크된 공지사항 삭제
 */
export async function deleteNotice(checkedItems) {
  // checkedItems 배열의 길이만큼 ? 문자열로 채우고 ,와 공백으로 연결
  const placeholders = new Array(checkedItems.length).fill('?').join(', ');
  const sql = `delete from notice where notice_id in (${placeholders})`

  return db
    .execute(sql, checkedItems)
    .then(result => 'ok')
};

export async function updateNotice({ title, content, imageFile }) {

}