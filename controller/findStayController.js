import * as findStayRepository from '../repository/findStayRepository.js';

export async function getAccList(req,res) {
    const { personnel, minPrice, maxPrice, sort, checkin, checkout} = req.query;

    try {
        const result = await findStayRepository.getAccList({ personnel, minPrice, maxPrice, sort, checkin, checkout});
        res.json(result);
    } catch (error) {
        console.error('DB에서 숙소리스트 가져오는 중 에러 발생 => ' + error);
        res.status(500).json({ error: '서버 에러' });
    }
};