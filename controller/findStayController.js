import * as findStayRepository from '../repository/findStayRepository.js';

/* 숙소리스트 */
export async function getAccList(req,res) {
    const { searched, location, checkin, checkout,  personnel, minPrice, maxPrice, isParking, isCook, isPet, isBreakfast, sort, page} = req.query;
    const pageSize = 4;
    const startIndex = (page - 1) * pageSize + 1; // 1,5,9...
    const endIndex = startIndex + 3; // 4,8,12...

    try {
        const result = await findStayRepository.getAccList({ searched, location, checkin, checkout,  personnel, minPrice, maxPrice, isParking, isCook, isPet, isBreakfast, sort, startIndex, endIndex });
        res.json(result);
    } catch (error) {
        console.error('DB에서 숙소리스트 가져오는 중 에러 발생 => ' + error);
        res.status(500).json({ error: '서버 에러' });
    }
}
/* 숙소 좋아요 수 */


/* 유저가 좋아요 누른 숙소리스트 */
export async function getUserLoveAccList(req, res) {
    const { userId } = req.params;
    console.log(userId);
    try{
        const result = await findStayRepository.getUserLoveAccList({ userId });
        res.json(result);
        console.log(result);
    }catch(error){
        console.error('유저가 좋아요 한 숙소리스트 가져오는 중 에러 발생 => ' + error);
    }
}

/* 좋아요 누르면 관심스테이 테이블에 추가, 삭제 */
export async function addLove(req,res) {
    const { userId, accId } = req.body;
    try{
        const insertResult = await findStayRepository.addLove({ userId, accId });

        if(insertResult === 'ok'){
            const updateResult = await findStayRepository.addAccLove({ accId });
            (updateResult !== 'ok') && console.error('숙소 테이블에 좋아요 + 1 하는중 에러 발생 => ' + error);
        }
        res.json(insertResult);
    }catch(error){
        console.error('관심스테이에 insert하는 중 에러 발생 => ' + error);
    }
}

export async function removeLove(req,res) {
    const { userId, accId } = req.body;

    try{
        const deleteResult = await findStayRepository.removeLove({ userId, accId });

        if(deleteResult === 'ok'){
            const updateResult = await findStayRepository.removeAccLove({ accId });
            (updateResult !== 'ok') && console.error('숙소 테이블에 좋아요 - 1 하는중 에러 발생 => ' + error);
        }
        res.json(deleteResult);
    }catch(error){
        console.error('관심스테이에서 delete 중 에러 발생 => ' + error);
    }
}