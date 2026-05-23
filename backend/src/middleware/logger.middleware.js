/**
 * ══════════════════════════════════════════════════════════
 * REQUEST LOGGER MIDDLEWARE
 * ══════════════════════════════════════════════════════════
 */

export const requestLogger = (req, res, next) => {
  // Apenas loga em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    console.log(`[${timestamp}] ${method} ${url}`);
  }
  next();
};

export default requestLogger;
