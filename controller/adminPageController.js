import * as adminPageRepository from '../repository/adminPageRepository.js';

/* 숙소리스트 조회 */
export async function getAccList(req,res) {
    try {
        const result = await adminPageRepository.getAccList();
        res.json(result);
    } catch (error) {
        console.error('DB에서 숙소리스트 가져오는 중 에러 발생 => ' + error);
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


