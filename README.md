Axiom is a full-stack, real-time log monitoring and observability demo platform. It simulates log ingestion, persistence, and live streaming with intelligent insights—designed to showcase modern event-driven architectures.

🧩 Tech Stack
Frontend
React (Vite)
Tailwind CSS
React Router
Backend
Node.js (Express)
Socket.IO (real-time communication)
MongoDB (via Mongoose)
Architecture Flow
Log Ingestion → MongoDB Persistence → WebSocket Broadcast → Live UI Updates
✨ Key Features
🔴 Real-Time Log Streaming via Socket.IO
⚠️ Incident Alert Broadcasting
🤖 AI Insight Event Simulation
📊 System Metrics Monitoring
🧪 Stress Testing & Log Simulation Engine
🧭 Multi-View Dashboard
Command Center
Logs
Timeline
Insights
Settings
📁 Project Structure
axiom-main/
├── client/    # Frontend (React + Vite)
└── server/    # Backend (Express + Socket.IO + MongoDB)
⚙️ Prerequisites

Ensure you have:

Node.js ≥ 18 (Recommended: Node 20 LTS)
npm ≥ 9
MongoDB (local or cloud instance)
