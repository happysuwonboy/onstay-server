import express from "express";
import * as adminPageController from '../controller/adminPageController.js';

const router = express.Router();

router.get('/accs', adminPageController.getAccList);


{/** 회원 관리  */}

router.get('/users', adminPageController.getAllUsers);

{/**1:1 문의 관리 */}

router.get('/questions/:answer_state', adminPageController.getAllQuestions);

router.post('/answer', adminPageController.postAnswer)

router.put('/answer', adminPageController.updateAnswer)
 
router.delete('/answer', adminPageController.removeAnswer)



export default router;