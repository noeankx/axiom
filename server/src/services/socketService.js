class SocketService {
  constructor(io) {
    this.io = io;
  }

  // Broadcast a new log to all connected clients
  emitNewLog(log) {
    this.io.emit('log_stream', log);
  }

  // Broadcast system metrics
  emitMetrics(metrics) {
    this.io.emit('system_metrics', metrics);
  }

  // Broadcast an incident alert
  emitIncident(incident) {
    this.io.emit('incident_alert', incident);
  }

  // Broadcast AI insights
  emitInsight(insight) {
    this.io.emit('ai_insight', insight);
  }
}

let socketServiceInstance = null;

const initSocketService = (io) => {
  socketServiceInstance = new SocketService(io);
  return socketServiceInstance;
};

const getSocketService = () => {
  if (!socketServiceInstance) {
    throw new Error('SocketService not initialized');
  }
  return socketServiceInstance;
};

module.exports = { initSocketService, getSocketService };
