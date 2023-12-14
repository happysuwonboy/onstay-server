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


export async function getAllUsers(req,res) {
    const rows = await adminPageRepository.getAllUsers();
    res.status(200).send(rows)
}