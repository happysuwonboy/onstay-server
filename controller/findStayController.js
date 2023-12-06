import * as findStayRepository from '../repository/findStayRepository.js';

/* 숙소리스트 */
export async function getAccList(req,res) {
    const { searched, location, checkin, checkout,  personnel, minPrice, maxPrice, isParking, isCook, isPet, isBreakfast, sort} = req.query;

    // const startIndex = (page - 1) * pageSize + 1;
    // const endIndex = startIndex + 3;

    try {
        const result = await findStayRepository.getAccList({ searched, location, checkin, checkout,  personnel, minPrice, maxPrice, isParking, isCook, isPet, isBreakfast, sort });
        res.json(result);
    } catch (error) {
        console.error('DB에서 숙소리스트 가져오는 중 에러 발생 => ' + error);
        res.status(500).json({ error: '서버 에러' });
    }
}