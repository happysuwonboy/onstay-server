// accDetailRouter.js

import express from 'express';
import * as getAccommodationName from '../controller/accDetailController.js';

const router = express.Router();

router.get('/:accid', getAccommodationName.getAccInfo);
router.get('/:accid/room', getAccommodationName.getRoomInfo)
router.get('/:accid/summary', getAccommodationName.getSummary)
router.get('/:accid/map', getAccommodationName.getMap)
router.get('/:accid/reserve', getAccommodationName.getReverve)

export default router;
