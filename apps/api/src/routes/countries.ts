import { Router, type IRouter } from 'express';
import { getCountries } from '../data.js';

const router: IRouter = Router();

router.get('/', (_req, res) => {
  res.json({ data: getCountries() });
});

export default router;
