import express from 'express';
import * as getVisualImage from '../controller/accVisualController.js';

const router = express.Router();

router.get('/', getVisualImage.getVisual);
export default router;