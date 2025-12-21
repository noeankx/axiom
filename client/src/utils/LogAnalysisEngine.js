/**
 * LogAnalysisEngine.js
 * 
 * Client-side heuristic engine for real-time log intelligence.
 * Processes the raw log stream to detect patterns, anomalies, and velocity changes.
 */

export const analyzeLogWindow = (logs, windowSize = 50) => {
  if (!logs || logs.length === 0) return null;

  const windowLogs = logs.slice(0, windowSize);
  const now = Date.now();
  
  // 1. Velocity Analysis (Logs per second approximation)
  // We assume logs come in roughly ordered by time.
  const timeSpan = windowLogs.length > 1 
      ? (new Date(windowLogs[0].timestamp) - new Date(windowLogs[windowLogs.length - 1].timestamp)) / 1000
      : 1;
  const velocity = windowLogs.length / (timeSpan || 1);

  // 2. Pattern Clustering (Identify repeated error messages)
  const clusters = {};
  windowLogs.forEach(log => {
      if (log.level === 'ERROR' || log.level === 'WARN') {
          // Simple signature: Service + Message body (taking first 20 chars to group similar errors)
          const signature = `${log.service}:${log.message.substring(0, 30)}`;
          if (!clusters[signature]) {
              clusters[signature] = { count: 1, service: log.service, message: log.message, level: log.level };
          } else {
              clusters[signature].count++;
          }
      }
  });

  // Filter for significant clusters (more than 3 of the same error in the window)
  const significantClusters = Object.values(clusters)
      .filter(c => c.count >= 3)
      .sort((a, b) => b.count - a.count);

  // 3. Service Health Score (0-100)
  // Calculate based on ratio of non-INFO logs
  const errorCount = windowLogs.filter(l => l.level === 'ERROR').length;
  const warnCount = windowLogs.filter(l => l.level === 'WARN').length;
  const healthScore = Math.max(0, 100 - (errorCount * 5) - (warnCount * 2));

  return {
      velocity: velocity.toFixed(1),
      clusters: significantClusters,
      healthScore: Math.round(healthScore),
      topError: significantClusters.length > 0 ? significantClusters[0] : null
  };
};

export const detectThreats = (logs) => {
  // Simple heuristic for "Security" threats
  const threats = [];
  const authFailures = logs.filter(l => l.message.toLowerCase().includes('auth') && l.level === 'ERROR');
  
  if (authFailures.length > 5) {
      threats.push({
          id: 'brute-force',
          severity: 'HIGH',
          label: 'Potential Brute Force',
          source: 'Auth Service',
          count: authFailures.length
      });
  }

  const sqlErrors = logs.filter(l => l.message.toLowerCase().includes('sql') || l.message.toLowerCase().includes('database'));
  if (sqlErrors.length > 3) {
      threats.push({
          id: 'sql-instability',
          severity: 'MEDIUM',
          label: 'Database Instability',
          source: 'Database',
          count: sqlErrors.length
      });
  }

  return threats;
};
