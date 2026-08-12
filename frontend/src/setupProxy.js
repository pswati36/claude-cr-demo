const { createProxyMiddleware } = require('http-proxy-middleware');

const backendPort = process.env.BACKEND_PORT || 3001;

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `http://localhost:${backendPort}`,
      changeOrigin: true,
    })
  );
};
