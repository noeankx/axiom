const { getSocketService } = require('../services/socketService');
const logIngestor = require('../services/logIngestor');
const { v4: uuidv4 } = require('uuid');

class LogSimulator {
  constructor() {
    this.isActive = false;
    this.intervalId = null;
    
    // Default Configuration
    this.config = {
      trafficMultiplier: 1, // 1x to 10x
      errorRate: 0.02,      // 2% base error rate
      latencyBias: 0,       // Added ms to latency
      activeScenario: null  // 'DB_FAILURE', 'AUTH_SPIKE', 'NETWORK_LAG', null
    };

    this.services = ['api-gateway', 'auth-service', 'user-service', 'payment-api', 'notification-worker', 'analytics-engine'];
    this.levels = ['INFO', 'INFO', 'INFO', 'WARN', 'ERROR', 'DEBUG']; 
  }

  start() {
    if (this.isActive) return;
    this.isActive = true;
    console.log('[Simulator] Started generating logs...');

    const scheduleNext = () => {
      if (!this.isActive) return;

      this.generateBatch();
      
      // Dynamic delay based on traffic multiplier
      // Base delay 200-800ms. High traffic divides this delay.
      const baseDelay = Math.floor(Math.random() * (800 - 200) + 200); 
      const adjustedDelay = Math.max(50, baseDelay / this.config.trafficMultiplier);

      setTimeout(scheduleNext, adjustedDelay);
    };

    scheduleNext();
  }

  stop() {
    this.isActive = false;
    console.log('[Simulator] Stopped.');
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log('[Simulator] Config updated:', this.config);
  }

  // Inject a specific causal scenario
  injectScenario(type) {
    console.log('[Simulator] Injecting Scenario:', type);
    this.config.activeScenario = type;
    
    // Automatically clear scenario after some time to avoid permanent death
    setTimeout(() => {
        if (this.config.activeScenario === type) {
            this.config.activeScenario = null;
            console.log('[Simulator] Scenario cleared:', type);
        }
    }, 15000); // 15 seconds duration

    // Trigger immediate effect
    this.generateCausalChain(type);
  }

  generateBatch() {
    // Traffic multiplier increases batch size
    const baseCount = Math.floor(Math.random() * 5) + 1;
    const count = Math.ceil(baseCount * (this.config.trafficMultiplier > 5 ? 2 : 1));
    
    for (let i = 0; i < count; i++) {
        this.generateLog();
    }
  }

  generateLog() {
    let service = this.services[Math.floor(Math.random() * this.services.length)];
    let level = this.levels[Math.floor(Math.random() * this.levels.length)];
    
    // Scenario Overrides
    if (this.config.activeScenario === 'DB_FAILURE' && (service === 'user-service' || service === 'payment-api')) {
        if (Math.random() < 0.6) level = 'ERROR';
    }
    if (this.config.activeScenario === 'AUTH_SPIKE' && service === 'auth-service') {
        if (Math.random() < 0.4) level = 'WARN';
    }

    // Global Error Rate Injection
    if (Math.random() < this.config.errorRate) {
        level = 'ERROR';
    }

    const message = this.getMessage(service, level);
    const traceId = uuidv4().split('-')[0]; // Short trace ID

    const logData = {
      timestamp: new Date(),
      level,
      service,
      message,
      traceId, 
      host: `worker-${Math.floor(Math.random() * 10)}`,
      latency: Math.floor(Math.random() * 50) + this.config.latencyBias,
      metadata: { region: 'us-east-1' }
    };

    logIngestor.ingest(logData);
  }

  // Generates a linked chain of logs across services to demonstrate causality
  async generateCausalChain(scenario) {
    let traceId = `TRACE-${Math.floor(Math.random() * 10000)}`;
    
    if (scenario === 'DB_FAILURE') {
        traceId = `DB_ERR-${Math.floor(Math.random() * 10000)}`;
        // 1. API Gateway receives request
        this.emitDirectLog('INFO', 'api-gateway', 'Incoming POST /api/checkout', traceId, 10);
        await this.wait(50);
        
        // 2. Auth Check
        this.emitDirectLog('INFO', 'auth-service', 'Validating token...', traceId, 20);
        await this.wait(50);

        // 3. User Service (Fails)
        this.emitDirectLog('ERROR', 'user-service', 'DB Connection Timeout: primary-01', traceId, 2500);
        
        // 4. Propagated Error
        await this.wait(20);
        this.emitDirectLog('ERROR', 'api-gateway', '503 Service Unavailable', traceId, 2550);
        
        // Broadcast System Alert via Socket
        try {
            getSocketService().emitIncident({
                id: uuidv4(),
                title: 'Database Connection Timeout',
                service: 'user-service',
                severity: 'CRITICAL',
                timestamp: new Date(),
                traceId: traceId
            });
        } catch (e) { console.error(e); }

    } else if (scenario === 'NETWORK_LAG') {
         traceId = `NET_LAG-${Math.floor(Math.random() * 10000)}`;
         // Chain for latency
         this.emitDirectLog('INFO', 'api-gateway', 'Incoming GET /api/feed', traceId, 10);
         await this.wait(800);
         this.emitDirectLog('WARN', 'api-gateway', 'Upstream dependency slow response', traceId, 850);
    } // Add generic catch for other cases or keep random if needed
  }

  emitDirectLog(level, service, message, traceId, latency) {
      const log = {
          timestamp: new Date(),
          level,
          service,
          message,
          traceId,
          host: 'worker-simulation',
          latency,
          metadata: { type: 'causal-chain' }
      };
      logIngestor.ingest(log);
  }

  wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  getMessage(service, level) {
    const messages = {
      INFO: ['Request processed', 'Cache hit', 'Job completed', 'Health check passed', 'Data synced', 'Session created', 'Payload validated'],
      WARN: ['High latency detected', 'Memory usage > 80%', 'Rate limit approaching', 'Retrying connection', 'Deprecation warning'],
      ERROR: ['Database timeout', 'Connection refused', 'NullPointer Exception', 'Payment gateway unreachable', 'Transaction failed', 'Disk quota exceeded'],
      DEBUG: ['Parsing payload', 'User session refreshed', 'WebSocket handshake', 'Garbage collection', 'Config loaded', 'Query executed']
    };
    
    // Service specific overrides for realism
    if (service === 'database' && level === 'ERROR') return 'Connection pool exhaustion';
    if (service === 'auth-service' && level === 'WARN') return 'Invalid token attempt';

    return messages[level][Math.floor(Math.random() * messages[level].length)];
  }
}

// Singleton
const simulator = new LogSimulator();
module.exports = simulator;
