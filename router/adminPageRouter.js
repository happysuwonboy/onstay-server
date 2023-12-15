import express from "express";
import * as adminPageController from '../controller/adminPageController.js';

const router = express.Router();

router.get('/accs/:page', adminPageController.getAccList);
router.post('/accs/insert/', adminPageController.insertAcc);

export default router;