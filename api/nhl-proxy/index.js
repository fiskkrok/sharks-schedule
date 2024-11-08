const fetch = require('node-fetch');

module.exports = async function (context, req)
{
    try
    {
        const path = req.params.path;
        const nhlResponse = await fetch(`https://api-web.nhle.com/v1/${path}`);

        if (!nhlResponse.ok)
        {
            throw new Error(`NHL API responded with ${nhlResponse.status}`);
        }

        const data = await nhlResponse.json();

        context.res = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Cache-Control': 'no-cache'
            },
            body: data
        };
    } catch (error)
    {
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: { error: error.message }
        };
    }
};