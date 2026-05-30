import pino from 'pino';
import { app } from './app.js';

const logger = pino({ transport: { target: 'pino-pretty' } });
const PORT = process.env['PORT'] ? parseInt(process.env['PORT'], 10) : 3001;

app.listen(PORT, () => {
  logger.info(`Arms Atlas API running on http://localhost:${PORT}`);
});
