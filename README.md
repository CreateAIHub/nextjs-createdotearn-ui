# Telegram-Bitte

Telegram-Bitte is an innovative AI-powered chatbot application built for the NEAR Protocol ecosystem, featuring Shade Agents, Chain Signatures, and cross-chain interactions for seamless blockchain operations.

## Features

- **NEAR Protocol Integration**: Native support for NEAR blockchain operations and smart contracts
- **Shade Agents**: Autonomous AI agents running in Trusted Execution Environments (TEEs)
- **Chain Signatures**: Cross-chain transaction capabilities for Bitcoin, Ethereum, and other networks
- **NEAR Intents**: Atomic P2P transactions and intent-based operations
- **Responsive UI**: Modern and intuitive interface designed for both desktop and mobile devices
- **AI Chat Interface**: Sophisticated chatbot powered by NEAR Protocol Shade Agents
- **Multi-chain Support**: Execute transactions across multiple blockchain networks

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, TypeScript
- **Blockchain**: NEAR Protocol, Chain Signatures
- **AI Agents**: Shade Agents framework
- **Backend**: Next.js API routes, NEAR SDK
- **Styling**: Tailwind CSS with custom components
- **Cross-chain**: NEAR Chain Signatures for Bitcoin, Ethereum integration

## NEAR Protocol Features

### Shade Agents
- **NEAR DeFi Agent**: Specialized in NEAR Protocol DeFi operations
- **Chain Signature Agent**: Handles cross-chain transactions
- **NEAR Intents Agent**: Processes atomic swaps and P2P trading
- **Shade Agent Coordinator**: Orchestrates complex multi-chain operations

### Chain Signatures
- Cross-chain Bitcoin transactions
- Ethereum smart contract interactions
- Multi-chain asset management
- Decentralized key management

### NEAR Intents
- Atomic P2P transactions
- Intent-based trading
- Cross-chain asset swaps
- Simplified user experience

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd telegram-bitte
   ```

2. Install dependencies:
   
   ```
   npm install
   # or
   pnpm install
   ```
3. Set up environment variables:
   Create a .env.local file with the following values:
   
   ```
   NEXT_PUBLIC_NEAR_NETWORK=testnet
   NEXT_PUBLIC_NEAR_NODE_URL=https://rpc.
   testnet.near.org
   NEXT_PUBLIC_NEAR_WALLET_URL=https://wallet.
   testnet.near.org
   NEXT_PUBLIC_NEAR_HELPER_URL=https://helper.
   testnet.near.org
   NEXT_PUBLIC_SHADE_AGENTS_REGISTRY=https://
   shade-agents-registry.near.org
   ```
4. Run the development server:
   
   ```
   npm run dev
   # or
   pnpm dev
   ```
5. Open http://localhost:3000 to view it in your browser.
## How to Use
1. Connect NEAR Wallet : Click to connect your NEAR Protocol wallet
2. Chat with Shade Agents : Interact with AI agents for various blockchain operations
3. Cross-chain Transactions : Use Chain Signatures for Bitcoin and Ethereum operations
4. NEAR Intents : Create atomic swaps and P2P transactions
5. DeFi Operations : Stake NEAR tokens and interact with DeFi protocols
## Available Shade Agents
- NEAR DeFi Agent : Staking, yield farming, DeFi protocol interactions
- Chain Signature Agent : Cross-chain Bitcoin/Ethereum transactions
- NEAR Intents Agent : Atomic swaps, P2P trading, intent processing
- Shade Agent Coordinator : Complex multi-chain operation orchestration

### Key APIs
- /api/chat - Main chat interface with Shade Agent selection
- /api/near - NEAR Protocol wallet and contract interactions
- /api/shade-agents - Shade Agents registry and management
- /api/intents - NEAR Intents processing
## NEAR Hackathon Features
This project was built for the NEAR Protocol hackathon, showcasing:

1. Shade Agents Integration : Autonomous AI agents in TEEs
2. Chain Signatures : Cross-chain transaction capabilities
3. NEAR Intents : Simplified intent-based interactions
4. Multi-chain Coordination : Seamless cross-chain operations
5. User-friendly Interface : Intuitive chat-based blockchain interactions
## Contributing
We welcome contributions! Please fork the repository and create a pull request with your changes. Make sure to:

- Follow TypeScript best practices
- Test NEAR Protocol integrations thoroughly
- Adhere to the project's coding standards
- Include tests for new Shade Agent integrations
## License
This project is licensed under the MIT License. See the LICENSE file for details.

## NEAR Protocol Resources
- NEAR Protocol Documentation
- Shade Agents Documentation
- Chain Signatures Guide
- NEAR Intents Documentation
## Contact
For questions about NEAR Protocol integration or Shade Agents, reach out to the development team.

Powered by NEAR Protocol, Shade Agents & Chain Signatures 🚀