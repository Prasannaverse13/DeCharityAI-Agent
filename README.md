# DeCharity AI - Blockchain-Powered Charitable Giving Platform

A cutting-edge DeFi charity platform leveraging Sonic blockchain technology for transparent and innovative cryptocurrency donations. The platform combines cyberpunk aesthetics with advanced AI-driven recommendations and blockchain integration.

## Key Features

- 🤖 AI-Powered Recommendations
- 🔗 Sonic Blockchain Integration
- 💡 Smart Contract Donations
- 💬 AI Assistant for User Support
- 🎯 Personalized Charity Matching
- 🧠 Allora Network AI Integration

## Technology Stack

- **Frontend**: React/TypeScript with Tailwind CSS
- **Backend**: Node.js/Express
- **Blockchain**: Sonic Network
- **AI**: Allora Network API & NVIDIA AI Integration (Llama 3.3)
- **State Management**: TanStack Query & Zustand

## Key Files & Features

### Blockchain Integration
- `client/src/lib/web3.ts`: Web3 configuration and Sonic blockchain integration
  - Contains wallet connection logic
  - Sonic network configuration (testnet/mainnet)
  - Transaction handling for donations

### AI Integration
- `shared/allora.ts`: Allora Network AI integration
  - API configuration and types
  - Inference fetching and processing
  - Confidence interval calculations
- `client/src/lib/ai.ts`: AI recommendation system
  - Combines Allora predictions with user preferences
  - Dynamic scoring and confidence calculation
  - Fallback handling for offline scenarios
- `server/routes/allora.ts`: Backend Allora integration
  - Topic management endpoints
  - Funding operations
  - API error handling

### Smart Contracts
- Uses Sonic blockchain for secure transactions
- Testnet Configuration:
  - RPC URL: https://rpc.blaze.soniclabs.com
  - Chain ID: 57054
  - Explorer: https://testnet.sonicscan.org

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   ```
   NVIDIA_API_KEY=your_api_key
   ALLORA_API_KEY=your_allora_api_key
   ```
4. Run the development server: `npm run dev`

## Features Usage

### Wallet Connection
1. Click "Connect Wallet" on the homepage
2. Approve MetaMask connection
3. Platform automatically configures for Sonic network

### Making Donations
1. Browse AI-recommended charities
2. Select donation amount
3. Confirm transaction in MetaMask
4. Track transaction on Sonic blockchain explorer

### AI Assistant
- Access the AI chat interface on the dashboard
- Ask questions about:
  - Donation process
  - Charity verification
  - Blockchain technology
  - Impact tracking

### Allora AI Integration
- Real-time charity recommendations powered by Allora Network
- Features:
  - Dynamic scoring based on blockchain activity
  - Confidence intervals for prediction reliability
  - Automatic preference matching
  - Fallback to local scoring when needed

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── lib/          # Utilities and blockchain logic
│   │   └── pages/        # Route components
├── server/
│   ├── routes/
│   │   └── allora.ts     # Allora Network integration
│   ├── routes.ts         # API endpoints and AI integration
│   └── storage.ts        # Data management
└── shared/
    ├── allora.ts         # Allora types and utilities
    └── schema.ts         # Type definitions
```
