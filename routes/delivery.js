const express = require('express');
const router = express.Router();
const db = require('../models'); 

const STORE_COORDINATES = { lat: 51.4916, lng: -0.1924 };

async function loadFetch() {
    const { default: fetch } = await import('node-fetch');
    return fetch;
}

router.get('/delivery-charge', async (req, res) => {
    const { distance } = req.query; 
    try {
        const settings = await db.Settings.findOne({ where: { key: 'deliveryRate' } });
        const ratePerMile = settings ? settings.value.ratePerMile : 1; 
        const cost = calculateDeliveryCost(distance, ratePerMile);
        res.json({ deliveryCost: cost });
    } catch (error) {
        console.error('Failed to fetch delivery settings:', error);
        res.status(500).json({ error: 'Error fetching delivery settings.' });
    }
});

function calculateDeliveryCost(distance, ratePerMile) {
    const ratePerKilometer = ratePerMile / 1.609; 
    return Math.ceil(distance * ratePerKilometer * 2) / 2; 
}

module.exports = router;
