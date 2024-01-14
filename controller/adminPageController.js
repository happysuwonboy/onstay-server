import * as adminPageRepository from '../repository/adminPageRepository.js';
import * as memberRepository from '../repository/memberRepository.js';
import {sendPostAnswerNoti} from '../util/mailer.js';

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
        console.error('DB에서 숙소 상세 정보 가져오는 중 에러 발생 => ' + error);
    }
}
/* 숙소, 객실 등록 */
export async function insertAcc(req,res) {
    const { accName, tel, zipcode, address, latitude, longitude, parking, cook, pet, breakfast, accCheckin, accCheckout, homepage, registerDate, only, areaCode, accSummary1, accSummary2, rooms } = req.body;
    const accImgs = req.files.accImgs;
    const roomImgs0 = req.files.roomImg0;
    const roomImgs1 = req.files.roomImg1;
    const roomImgs2 = req.files.roomImg2;
    const roomForms = JSON.parse(req.body.rooms);
    try {
        const result = await adminPageRepository.insertAcc({accName, tel, zipcode, address, latitude, longitude, parking, cook, pet, breakfast, accCheckin, accCheckout, homepage, registerDate, only, areaCode, accSummary1, accSummary2});
        if(result === 'ok'){
            await roomForms.map(async(room, index) => {
                const roomName = roomForms[index].roomName;
                const roomPrice = roomForms[index].roomPrice;
                const featureCodeArr = roomForms[index].featureCodesArr;
                    const sortedFeatureCodesArr = [...featureCodeArr].sort((a, b) => a - b);
                    const featureCodes = sortedFeatureCodesArr.join(',');
                const amenities = roomForms[index].amenities;
                const minCapa = roomForms[index].minCapa;
                const maxCapa = roomForms[index].maxCapa;
                let roomImg1 = '';
                let roomImg2 = '';
                let roomImg3 = '';
                if(index===0){
                    roomImg1 = roomImgs0[0]?.filename || '';
                    roomImg2 = roomImgs0[1]?.filename || '';
                    roomImg3 = roomImgs0[2]?.filename || '';
                }else if(index===1){
                    roomImg1 = roomImgs1[0]?.filename || '';
                    roomImg2 = roomImgs1[1]?.filename || '';
                    roomImg3 = roomImgs1[2]?.filename || '';
                }else if(index===2){
                    roomImg1 = roomImgs2[0]?.filename || '';
                    roomImg2 = roomImgs2[1]?.filename || '';
                    roomImg3 = roomImgs2[2]?.filename || '';
                }
                const result = await adminPageRepository.insertRoom({roomName, roomPrice, featureCodes, amenities, minCapa, maxCapa, roomImg1, roomImg2, roomImg3});
            })
            if(result === 'ok'){
                await accImgs.map( async (img, index)=>{
                    const accImg = req.files.accImgs[index].filename;
                    const result = await adminPageRepository.insertAccImgs({accImg});
                })
                res.json('ok');
            }
        }
    } catch (error) {
        console.error('숙소 객실 insert 중 에러 발생 => ' + error);
    }
}
/* 숙소, 객실 수정 */
export async function updateAcc(req, res) {
    const { accId, accName, tel, zipcode, address, latitude, longitude, parking, cook, pet, breakfast, accCheckin, accCheckout, homepage, registerDate, only, areaCode, accSummary1, accSummary2, roomId } = req.body;
    const accImgs = req.files.accImgs;
    const roomImgs = req.files.roomImg;
    const roomForms = JSON.parse(req.body.rooms);
    console.log(roomImgs);
    try {
        const updateAccResult = await adminPageRepository.updateAcc({accId, accName, tel, zipcode, address, latitude, longitude, parking, cook, pet, breakfast, accCheckin, accCheckout, homepage, registerDate, only, areaCode, accSummary1, accSummary2});
        if(updateAccResult === 'ok'){
            await roomForms.map(async(room, index) => {
                const roomName = roomForms[index].roomName;
                const roomPrice = roomForms[index].roomPrice;
                const featureCodeArr = roomForms[index].featureCodesArr;
                    const sortedFeatureCodesArr = [...featureCodeArr].sort((a, b) => a - b);
                    const featureCodes = sortedFeatureCodesArr.join(',');
                const amenities = roomForms[index].amenities;
                const minCapa = roomForms[index].minCapa;
                const maxCapa = roomForms[index].maxCapa;
                const roomImg1 = roomImgs[0]?.filename || '';
                const roomImg2 = roomImgs[1]?.filename || '';
                const roomImg3 = roomImgs[2]?.filename || '';
                const result = await adminPageRepository.updateRoom({roomId, roomName, roomPrice, featureCodes, amenities, minCapa, maxCapa, roomImg1, roomImg2, roomImg3});
            })
            if(updateAccResult === 'ok'){
                const deleteAccImgsResult = await adminPageRepository.deleteAccImgs({accId});
                if(deleteAccImgsResult === 'ok'){
                    await accImgs.map( async (img, index)=>{
                        const accImg = req.files.accImgs[index].filename;
                        const updateAccImgsResult = await adminPageRepository.updateAccImgs({accId, accImg});
                    })
                    res.json('ok');
                }
            }
        }
    } catch (error) {
        console.error('숙소 객실 수정 중 에러 발생 => ' + error);
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


{/** 회원 관리 */}

export async function getAllUsers(req,res) {
    const rows = await adminPageRepository.getAllUsers();
    res.status(200).send(rows)
}

{/** 1:1 문의 관리 */}

export async function getAllQuestions(req,res) {
    const answer_state = req.params.answer_state==='Waiting' ? 0 : 1;
    const rows = await adminPageRepository.getAllQuestions(answer_state);
    res.status(200).send(rows)
}


export async function postAnswer(req,res) {
    const {user_id, question_title, question_id, answer_content} = req.body;
    const result = await adminPageRepository.postAnswer(question_id, answer_content);
    if (result==='ok') {
        const user = await memberRepository.getUserInfo(user_id);
        const user_email = user.user_email;
        await sendPostAnswerNoti(user_id, user_email, question_title) // 답변 등록 이메일
        res.status(201).send({message : '답변 등록이 완료되었습니다.'})
    } else {
        res.status(400).send({message : '답변이 이미 등록된 문의입니다.'})
    }
}

export async function updateAnswer(req,res) {
    const {answer_id, answer_content} = req.body;
    const result = await adminPageRepository.updateAnswer(answer_id, answer_content);
    if (result==='ok') {
        res.status(201).send({message : '답변 수정이 완료되었습니다.'})
    } else {
        res.status(400).send({message : '에러가 발생하여 수정에 실패하였습니다.'})
    }
}

export async function removeAnswer(req,res) {
    const question_id = req.body.question_id;
    const result = await adminPageRepository.removeAnswer(question_id)
    if (result==='ok') {
        res.status(204).send({message : '답변 삭제가 완료되었습니다.'})
    } else {
        res.status(400).send({message : '에러가 발생하여 답변을 삭제하지 못했습니다.'})
    }
}