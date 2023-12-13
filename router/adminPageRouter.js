import express from "express";
import * as adminPageController from '../controller/adminPageController.js';

const router = express.Router();

router.get('/accs', adminPageController.getAccList);


export default router;