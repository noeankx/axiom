const express = require('express');
const router = express.Router();
const logIngestor = require('../services/logIngestor');

// POST /api/logs/ingest
router.post('/ingest', async (req, res) => {
  try {
    const logData = req.body;
    
    // Basic validation
    if (!logData.service || !logData.message || !logData.level) {
      return res.status(400).json({ error: 'Missing required fields: service, message, level' });
    }

    // Process
    const savedLog = await logIngestor.ingest(logData);

    res.status(201).json({ success: true, logId: savedLog._id });
  } catch (error) {
    res.status(500).json({ error: 'Internal processing error' });
  }
});

module.exports = router;
