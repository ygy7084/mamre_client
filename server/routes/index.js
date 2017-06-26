import express from 'express';
import excel from './excel';
import reservation from './reservation';
import reserved_seat from './reserved_seat';
import show from './show';
import theater from './theater';

const router = express.Router();

router.use('/excel', excel);
router.use('/reservation', reservation);
router.use('/reserved_seat', reserved_seat);
router.use('/show', show);
router.use('/theater', theater);

export default router;