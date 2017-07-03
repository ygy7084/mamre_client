import express from 'express';
import excel from './excel';
import reservation from './reservation';
import show from './show';
import showtime from './showtime';
import theater from './theater';
import seats from './seats';

const router = express.Router();

router.use('/excel', excel);
router.use('/reservation', reservation);
router.use('/show', show);
router.use('/showtime', showtime);
router.use('/theater', theater);
router.use('/seats', seats);

export default router;