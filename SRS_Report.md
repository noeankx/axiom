
Project Name
**Axiom: Next-Gen System Intelligence & Log Management**

Software Requirements Specification

**Course Code:** [Insert Course Code]
**Course Name:** [Insert Course Name]

**Student Names:**
[Insert Name 1]
[Insert Name 2]

**Student Registration Numbers:**
[Insert Reg No 1]
[Insert Reg No 2]

Prepared for
**Continuous Assessment 3**
**Spring 2025**

---

**Table of Contents**

**REVISION HISTORY**	II
**1. INTRODUCTION**	1
  1.1 PURPOSE	1
  1.2 SCOPE	1
  1.3 DEFINITIONS, ACRONYMS, AND ABBREVIATIONS	1
  1.4 REFERENCES	1
  1.5 OVERVIEW	1
**2. GENERAL DESCRIPTION**	2
  2.1 PRODUCT PERSPECTIVE	2
  2.2 PRODUCT FUNCTIONS	2
  2.3 USER CHARACTERISTICS	2
  2.4 GENERAL CONSTRAINTS	2
  2.5 ASSUMPTIONS AND DEPENDENCIES	2
**3. SPECIFIC REQUIREMENTS**	2
  3.1 EXTERNAL INTERFACE REQUIREMENTS	3
    3.1.1 User Interfaces	3
    3.1.2 Hardware Interfaces	3
    3.1.3 Software Interfaces	3
    3.1.4 Communications Interfaces	3
  3.2 FUNCTIONAL REQUIREMENTS	3
    3.2.1 Real-Time Log Ingestion & Streaming	3
    3.2.2 AI-Driven System Intelligence (Copilot)	3
    3.2.3 Cyber-Security Threat Map	3
  3.5 NON-FUNCTIONAL REQUIREMENTS	3
    3.5.1 Performance	3
    3.5.2 Reliability	3
    3.5.3 Availability	3
    3.5.4 Security	3
    3.5.5 Maintainability	3
    3.5.6 Portability	3
  3.7 DESIGN CONSTRAINTS	3
  3.9 OTHER REQUIREMENTS	3
**4. ANALYSIS MODELS**	4
  4.1 DATA FLOW DIAGRAMS (DFD)	4
**5. GITHUB LINK**	5
**6. DEPLOYED LINK**	6
**7. CLIENT APPROVAL PROOF**	7
**8. CLIENT LOCATION PROOF**	8
**9. TRANSACTION ID PROOF**	9
**10. EMAIL ACKNOWLEDGEMENT**	10
**11. GST No**	11
**A. APPENDICES**	
  A.1 APPENDIX 1	

---

# 1. Introduction

The introduction to the Software Requirement Specification (SRS) document provides an overview of the complete SRS document for the **Axiom** project. This document contains all the information needed by a software engineer to adequately design and implement the software product described by the requirements listed in this document.

## 1.1 Purpose
The purpose of this SRS is to define the functional and non-functional requirements for **Axiom**, a comprehensive System Intelligence and Log Management Dashboard. It is intended for the development team, project stakeholders, and academic supervisors to ensure a shared understanding of the deliverables.

## 1.2 Scope
(1) **Product Name:** Axiom (Axiom Command)
(2) **Product Description:** Axiom is a full-stack web application designed to monitor distributed system health in real-time. It ingests logs from various microservices, analyzes them using simulated AI intelligence, and visualizes the data through a futuristic, high-performance user interface.
(3) **Application:**
    (a) **Goals:** To provide SREs and DevOps teams with a "single pane of glass" for monitoring system vitals, detecting security threats, and interacting with system data via natural language.
    (b) **Benefits:** Reduces mean-time-to-detection (MTTD) for system errors, provides intuitive visualization of complex data, and offers hands-free interaction via the Neural Voice Copilot.

## 1.3 Definitions, Acronyms, and Abbreviations
*   **SRS:** Software Requirements Specification
*   **SRE:** Site Reliability Engineering
*   **API:** Application Programming Interface
*   **Socket.IO:** A library for real-time web applications.
*   **MERN:** MongoDB, Express, React, Node.js stack.
*   **TTL:** Time To Live (database record expiration).
*   **Log Ingestion:** The process of importing log data into a database.

## 1.4 References
(1) IEEE Std 830-1998, IEEE Recommended Practice for Software Requirements Specifications.
(2) MongoDB Documentation (https://www.mongodb.com/docs/)
(3) React.js Documentation (https://react.dev/)
(4) Socket.IO Documentation (https://socket.io/)

## 1.5 Overview
The rest of this SRS is organized as follows: Section 2 describes the general factors affecting the product. Section 3 lists specific functional, non-functional, and interface requirements. Section 4 discusses analysis models suitable for the project. Sections 5-11 and Appendices provide project management and proof of delivery details.

# 2. General Description
This section describes the general factors that affect the product and its requirements.

## 2.1 Product Perspective
Axiom is a standalone software system acting as a central dashboard for observing other software services. It consists of a **Node.js/Express Backend** for data processing and a **React Frontend** for visualization. It interfaces with external services via REST APIs to receive logs.

## 2.2 Product Functions
The major functions of Axiom include:
*   **Live Log Stream:** displaying logs instantly as they arrive.
*   **System Health Monitoring:** Calculating real-time health scores based on error rates and latency.
*   **Threat Visualization:** A 3D map displaying active security threats and their origins.
*   **AI Copilot:** A chatbot interface (Neural Voice) responding to user queries about system status.
*   **Stress Lab:** A simulation module to inject synthetic load and errors for testing.

## 2.3 User Characteristics
The intended users are:
*   **System Administrators:** Technical experts who monitor server uptime and performance.
*   **Security Analysts:** Users focused on the Threat Map and security logs.
*   **Developers:** Users debugging applications using the Trace ID and Causality Visualizer features.

## 2.4 General Constraints
*   **Hardware:** Requires a client device capable of WebGL rendering (for 3D visualizers).
*   **Network:** Requires a stable internet connection for real-time WebSocket communication.
*   **Browser:** Optimized for modern browsers (Chrome, Firefox, Edge) due to advanced CSS and JS features.

## 2.5 Assumptions and Dependencies
*   It is assumed that the hosting environment supports Node.js v14+.
*   The system depends on a running MongoDB instance for log persistence.
*   The system assumes incoming logs follow a specific JSON structure (level, message, service).

# 3. Specific Requirements

## 3.1 External Interface Requirements

### 3.1.1 User Interfaces
*   **Dashboard Style:** The UI shall use a "Dark Mode" aesthetic with glassmorphism effects, monospaced fonts for data, and high-contrast alert indicators.
*   **Layout:** The main dashboard shall use a "Bento Grid" layout to organize widgets (Metrics, Maps, Logs) efficiently.
*   **Responsiveness:** The application shall be responsive, creating a usable experience on desktop and tablet screens.

### 3.1.2 Hardware Interfaces
*   No specific custom hardware required beyond standard server/client architecture.

### 3.1.3 Software Interfaces
*   **Database:** The system shall interface with MongoDB using Mongoose ODM.
*   **Web Server:** The backend shall run on an Express.js server.

### 3.1.4 Communications Interfaces
*   **HTTP Protocol:** REST API over HTTP/HTTPS for log ingestion.
*   **WebSocket Protocol:** Socket.IO for bidirectional real-time communication between server and client.

## 3.2 Functional Requirements

### 3.2.1 Real-Time Log Ingestion & Streaming
#### 3.2.1.1 Introduction
The system serves as a central hub for logs generated by various services.
#### 3.2.1.2 Inputs
JSON formatted log objects containing `timestamp`, `level` (INFO, WARN, ERROR), `service`, and `message`.
#### 3.2.1.3 Processing
The server validates the input, saves it to the MongoDB database, and immediately emits the log event via Socket.IO to all connected clients.
#### 3.2.1.4 Outputs
A persistent database record and a real-time update on the client dashboard.
#### 3.2.1.5 Error Handling
Invalid log formats return a 400 Bad Request. Database failures return a 500 Internal Server Error.

### 3.2.2 AI-Driven System Intelligence (Copilot)
#### 3.2.1.1 Introduction
A "Neural Core" chatbot that assists users in understanding system state.
#### 3.2.1.2 Inputs
Natural language text input from the user (e.g., "What is the system status?").
#### 3.2.1.3 Processing
The system parses keywords (status, error, alert) and queries the internal state (metrics, latest logs) to generate a context-aware response.
#### 3.2.1.4 Outputs
A text response displayed in the chat interface, simulating an AI persona (System, Sarcastic, etc.).

### 3.2.3 Cyber-Security Threat Map
#### 3.2.1.1 Introduction
Visualizes potential security threats on a map.
#### 3.2.1.2 Inputs
Log entries tagged with security-related keywords or specific "Threat" objects.
#### 3.2.1.3 Processing
The client filters stream data for security events and maps them to geographic regions (simulated).
#### 3.2.1.4 Outputs
Interactive nodes on the Threat Map visualization indicating source and severity.

## 3.5 Non-Functional Requirements

### 3.5.1 Performance
The system shall be capable of rendering at least 50 log entries per second without significant UI lag, utilizing UI virtualization or buffering where necessary.

### 3.5.2 Reliability
The WebSocket connection shall automatically attempt to reconnect if the network link is temporarily lost.

### 3.5.3 Availability
The system is designed for high availability (99.9%), dependent on the underlying hosting infrastructure.

### 3.5.4 Security
All API endpoints should be protected (future scope: API Key authentication). Cross-Origin Resource Sharing (CORS) is configured to allow authorized clients.

### 3.5.5 Maintainability
Codebase is modularized into `Components`, `pages`, and `services` to facilitate easy updates and bug fixes.

### 3.5.6 Portability
The client is platform-independent (web-based). The server is container-friendly (Node.js).

## 3.7 Design Constraints
*   Must use React.js for the frontend library.
*   Must use TailwindCSS for styling.
*   Must avoid direct DOM manipulation, relying on React's virtual DOM.

## 3.9 Other Requirements
*   **Zen Mode:** A specific requirement to allow a distraction-free view hiding non-essential UI elements.

# 4. Analysis Models

## 4.1 Data Flow Diagrams (DFD)
**Level 0 DFD:**
[External Service] --> (Send Logs) --> [Axiom Server] --> (Store) --> [MongoDB]
                                      |
                                      +--> (Emit Event) --> [Axiom Client Dashboard]

# 5. GITHUB LINK
[Insert GitHub Repository Link Here]

# 6. DEPLOYED LINK
[Insert Deployed Application URL Here]

# 7. CLIENT APPROVAL PROOF
[Insert Screenshot/Email of Client Approval]

# 8. CLIENT LOCATION PROOF
[Insert Location Proof if applicable]

# 9. TRANSACTION ID PROOF
[Insert Transaction ID if applicable]

# 10. EMAIL ACKNOWLEDGEMENT
[Insert Email Snapshot]

# 11. GST No
[Insert GST Number if applicable]

# A. Appendices

## A.1 Appendix 1
**Technology Stack Details:**
*   **Frontend:** Vite, React 18, Framer Motion (Animation), Lucide React (Icons).
*   **Backend:** Express 4, Mongoose 8.
*   **Real-time:** Socket.IO 4.
