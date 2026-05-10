import { Router, type IRouter } from 'express';
import { z } from 'zod';
import { getFlows, getCountryTotals, getTopPartners } from '../data.js';

const router: IRouter = Router();

const FlowQuerySchema = z.object({
  from: z.coerce.number().int().min(1950).max(2030).optional(),
  to: z.coerce.number().int().min(1950).max(2030).optional(),
  supplier: z.string().length(3).optional(),
  recipient: z.string().length(3).optional(),
  category: z.enum(['aircraft', 'missiles', 'naval', 'armored_vehicles', 'artillery', 'sensors', 'other']).optional(),
});

router.get('/', (req, res) => {
  const parsed = FlowQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid query parameters', details: parsed.error.issues });
    return;
  }

  const { from, to, supplier, recipient, category } = parsed.data;
  let flows = getFlows();

  if (from !== undefined) flows = flows.filter((f) => f.year >= from);
  if (to !== undefined) flows = flows.filter((f) => f.year <= to);
  if (supplier) flows = flows.filter((f) => f.supplierIso3 === supplier.toUpperCase());
  if (recipient) flows = flows.filter((f) => f.recipientIso3 === recipient.toUpperCase());
  if (category) flows = flows.filter((f) => f.weaponCategory === category);

  res.json({ data: flows, count: flows.length });
});

const ProfileQuerySchema = z.object({
  year: z.coerce.number().int().min(1950).max(2030).optional(),
});

router.get('/country/:iso/profile', (req, res) => {
  const iso = req.params.iso?.toUpperCase();
  if (!iso || iso.length !== 3) {
    res.status(400).json({ error: 'Invalid ISO3 code' });
    return;
  }

  const parsed = ProfileQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid query parameters', details: parsed.error.issues });
    return;
  }

  const targetYear = parsed.data.year;
  const decade = targetYear ? Math.floor(targetYear / 10) * 10 : undefined;

  const totals = getCountryTotals().filter(
    (t) => t.iso3 === iso && (targetYear === undefined || t.year === targetYear),
  );

  const totalExports = totals.reduce((sum, t) => sum + t.totalExports, 0);
  const totalImports = totals.reduce((sum, t) => sum + t.totalImports, 0);

  const partners = getTopPartners().find(
    (p) => p.iso3 === iso && (decade === undefined || p.decade === decade),
  );

  const flows = getFlows().filter(
    (f) =>
      (f.supplierIso3 === iso || f.recipientIso3 === iso) &&
      (targetYear === undefined || f.year === targetYear),
  );

  const weaponMix: Record<string, number> = {};
  for (const flow of flows) {
    weaponMix[flow.weaponCategory] = (weaponMix[flow.weaponCategory] ?? 0) + flow.tiv;
  }

  res.json({
    iso3: iso,
    year: targetYear,
    totalExports,
    totalImports,
    topSuppliers: partners?.topSuppliers ?? [],
    topRecipients: partners?.topRecipients ?? [],
    weaponMix,
  });
});

router.get('/country-totals', (_req, res) => {
  res.json({ data: getCountryTotals() });
});

export default router;
