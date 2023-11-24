import express from 'express';
import * as categoryController from '../controller/categoryController.js';

const router = express();

router.get('/only', categoryController.getAccOnly);
router.get('/price', categoryController.getAccPrice);
router.get('/img/:id', categoryController.getAccImg);

export default router;