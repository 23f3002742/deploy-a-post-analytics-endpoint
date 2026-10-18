export default function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');

    // Preflight  
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Auth
    const apiKey = req.headers['x-api-key'];
    const VALID_KEY = 'ak_le3x22abxx0g52dp88uo8aio';

    if (!apiKey || apiKey !== VALID_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Body
    const { events } = req.body || {};

    if (!Array.isArray(events)) {
        return res.status(400).json({ error: 'Invalid body: events must be an array' });
    }

    // Aggregation
    const total_events = events.length;
    const uniqueUsers = new Set();
    const positiveTotals = {};
    let revenue = 0;

    for (const event of events) {
        const user = event?.user;
        const amount = Number(event?.amount) || 0;

        if (user !== undefined && user !== null) {
            uniqueUsers.add(user);
        }

        if (amount > 0) {
            revenue += amount;
            positiveTotals[user] = (positiveTotals[user] || 0) + amount;
        }
    }

    // top_user (no ties guaranteed)
    let top_user = null;
    let maxPositive = -1;

    for (const [user, total] of Object.entries(positiveTotals)) {
        if (total > maxPositive) {
            maxPositive = total;
            top_user = user;
        }
    }

    return res.status(200).json({
        email: '23f3002742@ds.study.iitm.ac.in',
        total_events,
        unique_users: uniqueUsers.size,
        revenue,
        top_user
    });
}