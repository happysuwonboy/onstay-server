import express from 'express';
import * as accController from '../controller/accController.js'

const router = express.Router();

router.get('/:acc_id', accController.getAccommodation)

export default router 