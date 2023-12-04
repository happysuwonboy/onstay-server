import * as findStayRepository from '../repository/findStayRepository.js';

export async function getAccList(req,res) {
    const result = await findStayRepository.getAccList();
    res.json(result);
};