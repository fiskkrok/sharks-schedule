// api/index.js
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Enable CORS for all routes
app.use(cors());

// NHL API proxy
app.use('/v1', createProxyMiddleware({
    target: 'https://api-web.nhle.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api': ''
    },
    onProxyReq: (proxyReq) =>
    {
        // Add any required headers
        proxyReq.setHeader('Origin', 'https://api-web.nhle.com');
    }
}));

// Health check endpoint
app.get('/healthcheck', (req, res) =>
{
    res.status(200).json({ status: 'ok' });
});

// Vercel serverless function export
module.exports = app;