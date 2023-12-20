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
        console.error('DB에서 상세 정보 가져오는 중 에러 발생 => ' + error);
    }
}
/* 숙소, 객실 등록 */
export async function insertAcc(req,res) {
    const { accName, tel, zipcode, address, latitude, longitude, parking, cook, pet, breakfast, accCheckin, accCheckout, homepage, registerDate, only, areaCode, accSummary1, accSummary2, roomName, roomPrice, featureCodes, amenities, minCapa, maxCapa } = req.body;
    const roomImg1 = req.files.roomImg[0].filename;
    const roomImg2 = req.files.roomImg[1].filename;
    const roomImg3 = req.files.roomImg[2].filename;
    const accImgs = req.files.accImgs;
    try {
        const result = await adminPageRepository.insertAcc({accName, tel, zipcode, address, latitude, longitude, parking, cook, pet, breakfast, accCheckin, accCheckout, homepage, registerDate, only, areaCode, accSummary1, accSummary2});
        if(result === 'ok'){
            const result = await adminPageRepository.insertRoom({roomName, roomPrice, featureCodes, amenities, minCapa, maxCapa, roomImg1, roomImg2, roomImg3});
            if(result === 'ok'){
                await accImgs.map( async (img, index)=>{
                    const accImg = req.files.accImgs[index].filename;
                    const result = await adminPageRepository.insertAccImgs({accImg});
                })
                res.json('ok');
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