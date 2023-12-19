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
/* 숙소, 객실 상세정보 조회 */
export async function detailAcc(req, res) {
    const { accId, roomName } = req.query;
    try {
        const result = await adminPageRepository.detailAcc({accId, roomName});
        res.json(result);
    } catch (error) {
        console.error('DB에서 상세 정보 가져오는 중 에러 발생 => ' + error);
    }
}
/* 숙소, 객실 등록 */
export async function insertAcc(req,res) {
    const { accName, tel, zipcode, address, latitude, longitude, parking, cook, pet, breakfast, accCheckin, accCheckout, homepage, registerDate, only, areaCode, accSummary1, accSummary2, roomName, roomPrice, featureCodes, amenities, minCapa, maxCapa } = req.body;
    const roomImg = req.files;
    const roomImg1 = roomImg[0].filename;
    const roomImg2 = roomImg[1].filename;
    const roomImg3 = roomImg[2].filename;
    const accImgs = req.files;
    const accImg1 = accImgs[0].filename;
    try {
        const result = await adminPageRepository.insertAcc({accName, tel, zipcode, address, latitude, longitude, parking, cook, pet, breakfast, accCheckin, accCheckout, homepage, registerDate, only, areaCode, accSummary1, accSummary2});
        if(result === 'ok'){
            const result = await adminPageRepository.insertRoom({roomName, roomPrice, featureCodes, amenities, minCapa, maxCapa, roomImg1, roomImg2, roomImg3});
            if(result === 'ok'){
                const result = await adminPageRepository.insertAccImgs({accImg1})
                res.json(result);
            }
        }
    } catch (error) {
        console.error('숙소 insert 중 에러 발생 => ' + error);
    }
}
/* 숙소, 객실 삭제 */
export async function countRoomPerAcc(req,res) {
    const { accId, roomName } = req.body;
    try {
        const countRoomPerAccResult = await adminPageRepository.countRoomPerAcc({accId});
        if(countRoomPerAccResult > 1){
            //객실만 삭제
            const deleteRoomResult = await adminPageRepository.deleteRoom({roomName});
            res.json(deleteRoomResult);
        }else{
            //숙소, 객실 둘다 삭제
            const deleteAccResult = await adminPageRepository.deleteAcc({accId});
            res.json(deleteAccResult);
        }
    } catch (error) {
        console.error('숙소 delete 중 에러 발생 => ' + error);
    }
}