import express, { type Express } from 'express';
import { getMetadata, getFlows, getCountries } from './data.js';
import flowsRouter from './routes/flows.js';
import countriesRouter from './routes/countries.js';
import caseStudiesRouter from './routes/caseStudies.js';

export const app: Express = express();

app.use(express.json());

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (_req.method === 'OPTIONS') { res.sendStatus(204); return; }
  next();
});

const cache = new Map<string, { etag: string; body: string; expires: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000;

app.use('/api', (req, res, next) => {
  if (req.method !== 'GET') { next(); return; }
  const key = req.originalUrl;
  const hit = cache.get(key);
  if (hit && Date.now() < hit.expires) {
    if (req.headers['if-none-match'] === hit.etag) { res.status(304).end(); return; }
    res.setHeader('ETag', hit.etag);
    res.setHeader('Content-Type', 'application/json');
    res.send(hit.body);
    return;
  }
  const originalJson = res.json.bind(res);
  res.json = (body: unknown) => {
    const serialized = JSON.stringify(body);
    const etag = `"${Buffer.from(serialized).length.toString(36)}-${Date.now().toString(36)}"`;
    cache.set(key, { etag, body: serialized, expires: Date.now() + CACHE_TTL_MS });
    res.setHeader('ETag', etag);
    return originalJson(body);
  };
  next();
});

app.get('/api/health', (_req, res) => {
  const meta = getMetadata();
  const flowCount = getFlows().length;
  const countryCount = getCountries().length;
  res.json({
    status: 'ok',
    dataLoaded: flowCount > 0,
    coverage: meta?.yearCoverage ?? null,
    recordCount: flowCount,
    countryCount,
    citation: meta?.citation ?? null,
  });
});

app.use('/api/flows', flowsRouter);
app.use('/api/countries', countriesRouter);
app.use('/api/case-studies', caseStudiesRouter);

app.get('/api/metadata', (_req, res) => {
  const meta = getMetadata();
  if (!meta) { res.status(503).json({ error: 'Data not yet ingested.' }); return; }
  res.json(meta);
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});
