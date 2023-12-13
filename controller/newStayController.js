import * as newStayRepository from '../repository/newStayRepository.js';

/**
 * NewStaySection
 * @param {*} req 
 * @param {*} res 
 */
export async function getList(req, res) {
  const result = await newStayRepository.getList();
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
  const result = await newStayRepository.getAccList({ startIndex, endIndex });
  res.json(result);
}

export async function getTodayAcc(req, res) {
  const {page} = req.params;
  const result = await newStayRepository.getTodayAcc(page);
  res.json(result);
};

export async function addCoupon(req, res) {
  const {user_id, coupon_name, discount_price, acc_name} = req.body;
  const getCoupon = await newStayRepository.getCoupon(user_id);
  let validCouponFound = false;

  for (const coupon of getCoupon) {
    if(coupon.acc_name !== acc_name) {
      console.log(coupon. coupon_name, acc_name);
      await newStayRepository.addCoupon(user_id, coupon_name, discount_price);
      validCouponFound = true;
    } else {
      validCouponFound = false;
      break;
    }
  }

  if (validCouponFound) {
    res.json('ok');
  } else {
    res.json('not ok');
  }
};
