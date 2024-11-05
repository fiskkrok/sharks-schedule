// api/index.js
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Enable CORS for all routes
app.use(cors());

// NHL API proxy
const apiProxy = createProxyMiddleware({
    target: 'https://api-web.nhle.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api': ''
    },
    onProxyReq: (proxyReq) =>
    {
        proxyReq.setHeader('Origin', 'https://api-web.nhle.com');
    },
    onError: (err, req, res) =>
    {
        console.error('Proxy Error:', err);
        res.status(500).json({ error: 'Proxy Error', message: err.message });
    }
});

app.use('/api/v1', apiProxy);

// Health check endpoint
app.get('/api/healthcheck', (req, res) =>
{
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Handle root path
app.get('/api', (req, res) =>
{
    res.status(200).json({ message: 'NHL API Proxy Server' });
});

// Error handling
app.use((err, req, res, next) =>
{
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!', message: err.message });
});

// Export for Vercel
module.exports = app;