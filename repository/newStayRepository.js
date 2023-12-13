import { db } from '../db/database.js';

/**
 * NewStaySection
 * @returns 3개월 이내 등록된 숙소 데이터와 이미지
 */
export async function getList() {
  const sql = `
  select acc.acc_id, 
  acc.acc_name, 
  acc.register_date, 
  acc.area_code,
  acc.acc_summary1,
  acc_img.acc_img
  from accommodation acc, 
  acc_img_view acc_img
  where acc.acc_id = acc_img.acc_id
  and register_date between date_add(now(), interval -3 month) and now()`;
  return db
    .execute(sql)
    .then(row => row[0])
};

/**
 * NewAccContent
 * @returns 3개월 이내 등록된 숙소 데이터와 등록일과 현재일자 차이, 페이지별 데이터 추출
 */
export async function getAccList({ startIndex, endIndex }) {
  const sql = `
    select 
    no, acc_id, acc_name, area_code, register_date, acc_img, min_capa, max_capa, day_diff
    from (select 
    row_number() over (order by register_date desc) as no,  
    acc.acc_id, 
    acc.acc_name, 
    acc.area_code, 
    acc.register_date, 
    acc_img.acc_img, 
    room.min_capa, 
    room.max_capa, 
    datediff(curdate(), acc.register_date) as day_diff
    from 
    accommodation acc, room, acc_img_view acc_img
    where
    acc.acc_id = room.acc_id
    and acc.acc_id = acc_img.acc_id
    and register_date between date_add(now(), interval -3 month) and now()
    and room_name = '안채'
    order by
    register_date desc)
    as newacclist 
    where no between ? and ?`;

  return db
    .execute(sql, [startIndex, endIndex])
    .then(row => row[0])
};

export async function getTodayAcc(page) {
  const sql = `
  select no,
    acc_id, 
    acc_name, 
    register_date, 
    area_code,
    acc_summary1, 
    min_capa, 
    max_capa, 
    acc_imgs,
    room_price
  from (select
    row_number() over (order by register_date) as no,
    acc.acc_id, 
    acc_name, 
    register_date, 
    area_code,
    acc_summary1, 
    min(min_capa) min_capa, 
    max(max_capa) max_capa, 
    group_concat(distinct acc_img) acc_imgs,
    min(room_price) room_price
    from accommodation acc, 
    acc_img, 
    room
    where acc.acc_id = acc_img.acc_id
    and acc.acc_id = room.acc_id
    and register_date between date_add(now(), interval -1 day) and now()
    and acc_img like '%.jpg'
    group by acc.acc_id, 
    acc_name, 
    register_date, 
    area_code, 
    acc_summary1) as todaylist
    where no = ?`

  return db
    .execute(sql, [page])
    .then(rows => {
      return rows[0].map(row => ({
        acc_id: row.acc_id,
        acc_name: row.acc_name,
        register_date: row.register_date,
        area_code: row.area_code,
        acc_summary1: row.acc_summary1,
        min_capa: row.min_capa,
        max_capa: row.max_capa,
        acc_imgs: row.acc_imgs ? row.acc_imgs.split(',') : [],
        room_price: row.room_price,
      }))
    })
};

export async function addCoupon(user_id, coupon_name, discount_price) {
  const sql = `
  insert 
  into coupon(user_id,coupon_name,discount_price) 
  values(?, ?, ?)`

  return db
  .execute(sql, [user_id, coupon_name, discount_price])
  .then(result => 'ok');
};

export async function getCoupon(user_id) {
  const sql = `
  select 
  substring_index(substring_index(coupon_name, '[', -1), ']', 1) as coupon_name
  from coupon
  where user_id = ?`

  return db
  .execute(sql, [user_id])
  .then(rows => rows[0]);
};