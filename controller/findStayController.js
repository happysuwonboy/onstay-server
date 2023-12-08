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
/* 유저가 좋아요 한 숙소 목록 */
export async function getLoveAccList(req, res) {
    const { userId } = req.query;

    try{
        const result = await findStayRepository.getLoveAccList({ userId });
        res.json(result);
    }catch(error){
        console.error('유저가 좋아요 한 숙소 목록 가져오는 중 에러 발생 => ' + error);
    }
}

/* 좋아요 누르면 관심스테이 테이블에 추가, 삭제 */
export async function addLove(req,res) {
    const { userId, accId } = req.body;
    try{
        const insertResult = await findStayRepository.addLove({ userId, accId });
        if(res.json(insertResult) === 'ok'){
            const updateResult = await findStayRepository.addAccLove({ accId });
            (updateResult !== 'ok') &&  console.error('숙소테이블의 좋아요 수 증가시키는 중 에러 발생 => ' + error);
        }
        res.json(result);
    }catch(error){
        console.error('관심스테이에 insert하는 중 에러 발생 => ' + error);
    }
}

export async function removeLove(req,res) {
    const { userId, accId } = req.body;

    try{
        const result = await findStayRepository.removeLove({ userId, accId });
        res.json(result);
    }catch(error){
        console.error('관심스테이에서 delete 중 에러 발생 => ' + error);
    }
}