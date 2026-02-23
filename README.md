# Relayer Project - Blockchain Indexer

A production-ready blockchain indexer service built with NestJS that monitors Ethereum blockchain events and smart contract interactions in real-time.

## Project Description

This project is a blockchain indexer service that connects to an Ethereum node via WebSocket, listens for new blocks, and monitors specific smart contract events. It's designed to be a foundation for building decentralized applications that need to track blockchain activity in real-time.

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Blockchain Library**: ethers.js
- **Configuration**: @nestjs/config
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## Features

- Real-time blockchain event monitoring via WebSocket
- Smart contract event indexing
- Block number tracking
- Error handling and logging
- Modular architecture
- TypeScript with strict typing
- Environment-based configuration
- Comprehensive testing setup

## Project Architecture

```
relayer-project/
├── src/
│   ├── indexer/                    # Core indexing functionality
│   │   ├── indexer/
│   │   │   └── indexer.service.ts   # Main indexing service
│   │   ├── contract.abi.ts        # Smart contract ABI definition
│   │   └── indexer.module.ts      # NestJS module
│   ├── app.controller.ts           # REST API endpoints
│   ├── app.service.ts              # Business logic
│   └── app.module.ts               # Main application module
├── dist/                           # Compiled JavaScript
├── test/                          # Test files
├── .env.example                   # Environment variables template
└── package.json                   # Dependencies and scripts
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd relayer-project
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Ethereum Node Configuration
RPC_URL=ws://localhost:8545

# Smart Contract Configuration
CONTRACT_ADDRESS=0xYourContractAddressHere
```

## How to Run

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:cov

# Run end-to-end tests
npm run test:e2e
```

## Example Output

The indexer will output logs like:

```
Connected to blockchain. Current block: 15234567
New block received: 15234568
Event detected: Transfer { from: '0x123...', to: '0x456...', value: '1000' }
Event detected: Approval { owner: '0x123...', spender: '0x789...', value: '5000' }
```

## License

This project is currently unlicensed (UNLICENSED). Please contact the author for licensing information.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For support and questions, please open an issue in the repository.