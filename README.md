# AutoBilling-Agent (Work in Progress)

An automated, CLI/headless AI agent designed to handle billing workflows, invoice generation, and messaging integrations without relying on a GUI.

> **Status:** Active Development / Proof of Concept

## Overview
This project explores the integration of autonomous AI agents into backend financial workflows. Built to automate billing tasks and messaging actions (via Webhooks / APIs), it focuses on processing systemic inputs and executing decisions programmatically.

## Tech Stack & Architecture
- **Language/Runtime:** Node.js / TypeScript
- **AI Integration:** Function-calling agent frameworks
- **Database:** SQLite / Prisma ORM
- **Webhooks & APIs:** WhatsApp Meta Graph API, ngrok (Local Tunneling)

## Key Features (Implemented & Planned)
- [x] Webhook listener for external event triggers
- [x] Database integration for tracking billing records
- [/] AI Agent core logic & function execution (In Progress)
- [ ] Automated receipt generation & delivery pipeline

## System Architecture / Execution Flow
## Setup & Running Locally
```bash
# Clone repository
git clone https://github.com/kaizenyong2-cpu/whatsapp-billing-agent.git

# Install dependencies
npm install

# Run backend worker
npm run dev
