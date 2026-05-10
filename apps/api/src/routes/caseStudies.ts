import { Router, type IRouter } from 'express';
import { CASE_STUDIES, getCaseStudyBySlug } from '../caseStudies.js';

const router: IRouter = Router();

router.get('/', (_req, res) => {
  const summaries = CASE_STUDIES.map(({ slug, title, subtitle, yearRange, highlightedCountries }) => ({
    slug,
    title,
    subtitle,
    yearRange,
    highlightedCountries,
  }));
  res.json({ data: summaries });
});

router.get('/:slug', (req, res) => {
  const slug = req.params.slug;
  if (!slug) {
    res.status(400).json({ error: 'Missing slug' });
    return;
  }
  const study = getCaseStudyBySlug(slug);
  if (!study) {
    res.status(404).json({ error: 'Case study not found' });
    return;
  }
  res.json(study);
});

export default router;
