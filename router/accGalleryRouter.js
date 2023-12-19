import express from 'express';
import * as getAccGalleryImage from '../controller/accGalleryController.js';

const router = express.Router();

router.get('/:accid', getAccGalleryImage.getGalleryTop);
router.get('/:accid/middle', getAccGalleryImage.getGalleryMiddle);
router.get('/:accid/bottom', getAccGalleryImage.getGalleryBottom);
export default router;