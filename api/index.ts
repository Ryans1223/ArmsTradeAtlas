// Vercel serverless entry point — re-exports the Express app as a handler.
// Vercel's Node.js runtime detects and wraps Express apps exported as default.
export { app as default } from '../apps/api/src/app.js';
