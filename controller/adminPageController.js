import * as adminPageRepository from '../repository/adminPageRepository.js';

/* 숙소리스트 조회 */
export async function getAccList(req,res) {
    const { page } = req.params;
    const pageItem = 10;
    const startIndex = (page - 1) * pageItem + 1;
    const endIndex = startIndex + 9;
    try {
        const result = await adminPageRepository.getAccList({startIndex, endIndex});
        res.json(result);
    } catch (error) {
        console.error('DB에서 숙소리스트 가져오는 중 에러 발생 => ' + error);
    }
}
/* 숙소 등록 */
export async function insertAcc(req,res) {
    const { accName, tel, zipcode, address, latitude, longitude, parking, cook, pet, breakfast, accCheckin, accCheckout, homepage, registerDate, only, areaCode, accSummary1, accSummary2, roomName, roomPrice, featureCodes, amenities, minCapa, maxCapa } = req.body;
    try {
        const result = await adminPageRepository.insertAcc({accName, tel, zipcode, address, latitude, longitude, parking, cook, pet, breakfast, accCheckin, accCheckout, homepage, registerDate, only, areaCode, accSummary1, accSummary2});
        if(result === 'ok'){
            const result = await adminPageRepository.insertRoom({roomName, roomPrice, featureCodes, amenities, minCapa, maxCapa});
            res.json(result);
        }
    } catch (error) {
        console.error('숙소 insert 중 에러 발생 => ' + error);
    }
}