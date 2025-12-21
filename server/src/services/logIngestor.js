const Log = require('../models/Log');
const { getSocketService } = require('./socketService');

class LogIngestor {
  async ingest(logData) {
    try {
      // 1. Validate & Normalize
      const enrichedLog = {
        ...logData,
        timestamp: logData.timestamp || new Date(),
        // Assign default metadata if missing
        metadata: logData.metadata || { env: 'production', region: 'us-east-1' }
      };

      // 2. Persist to DB (Fire & Forget for speed in this demo, or await if critical)
      // In a real high-scale system, this would go to a queue (Kafka/RabbitMQ)
      const savedLog = await Log.create(enrichedLog);

      // 3. Stream to Real-time Dashboard
      try {
        const socketService = getSocketService();
        socketService.emitNewLog(savedLog);
        
        // Simple Real-time Analysis Hook
        this.analyzeLog(savedLog);
      } catch (err) {
        console.warn('Socket emit failed:', err.message);
      }

      return savedLog;
    } catch (error) {
      console.error('Ingestion Error:', error);
      throw error;
    }
  }

  // Lightweight immediate analysis
  analyzeLog(log) {
    const socketService = getSocketService();
    
    // Example: Detect Critical Errors immediately
    if (log.level === 'ERROR' && log.message.includes('Database timeout')) {
      socketService.emitIncident({
        id: `inc-${Date.now()}`,
        title: 'Database Connectivity Issue',
        severity: 'CRTICAL',
        timestamp: new Date(),
        service: log.service
      });
    }

    // Example: AI Insight for unusual activity
    if (log.level === 'WARN' && Math.random() > 0.8) {
       socketService.emitInsight({
         id: `insight-${Date.now()}`,
         type: 'ANOMALY',
         message: `Unusual latency pattern detected in ${log.service}`,
         confidence: 0.89
       });
    }
  }
}

module.exports = new LogIngestor();
