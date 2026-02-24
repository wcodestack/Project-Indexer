# Blockchain Indexer

A production-ready blockchain indexer service built with NestJS that monitors Ethereum blockchain events and smart contract interactions in real-time.

## Overview

This project is a blockchain indexer service that connects to an Ethereum node via WebSocket, listens for new blocks, and monitors specific smart contract events. It's designed to be a foundation for building decentralized applications that need to track blockchain activity in real-time.

### What it does
- Connects to Ethereum blockchain via WebSocket RPC
- Listens for new blocks in real-time
- Monitors smart contract events
- Stores event data in PostgreSQL database
- Provides a foundation for dApp development

### What blockchain it connects to
- Ethereum mainnet or testnets (Rinkeby, Ropsten, etc.)
- Requires WebSocket RPC endpoint

### What events it listens to
- All events emitted by the configured smart contract
- Block number tracking
- Transaction hash logging

### How it stores data in PostgreSQL
- Event name and contract address
- Block number and transaction hash
- Event arguments as JSON
- Timestamps for each event

## Tech Stack

- **Node.js** - JavaScript runtime
- **NestJS** - Progressive Node.js framework
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Relational database
- **Docker** - Containerization
- **WebSocket RPC** - Real-time blockchain connection

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database_name>"

# Ethereum Node Configuration
RPC_URL="wss://<your-websocket-rpc-url>" # Must be a WebSocket (wss://) RPC endpoint.

# Smart Contract Configuration
CONTRACT_ADDRESS="<deployed_contract_address>" # Must be the deployed smart contract address.
```

## Local Development Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Prisma CLI

### Installation
1. Clone the repository:
```bash
git clone <repository-url>
cd relayer-project
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up database:
```bash
npx prisma migrate dev
npx prisma generate
```

5. Start the application:
```bash
npm run start:dev
```

## Docker Setup

### Prerequisites
- Docker
- Docker Compose

### Running with Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f indexer

# Stop services
docker-compose down
```

### Docker Services
- **postgres**: PostgreSQL 15 database
- **indexer**: Relayer indexer service

## Project Structure

```
relayer-project/
├── src/
│   ├── indexer/                    # Core indexing functionality
│   │   ├── indexer/
│   │   │   └── indexer.service.ts   # Main indexing service
│   │   ├── contract.abi.ts        # Smart contract ABI definition
│   │   └── indexer.module.ts      # NestJS module
│   ├── database/
│   │   └── prisma.service.ts      # Prisma database service
│   └── app.module.ts               # Main application module
├── prisma/
│   └── schema.prisma               # Database schema
├── dist/                           # Compiled JavaScript
├── Dockerfile                      # Container configuration
├── docker-compose.yml              # Multi-service setup
├── .env.example                    # Environment variables template
├── package.json                    # Dependencies and scripts
└── README.md                       # This file
```

## How It Works Internally

### 1. Initialization
- Reads environment variables for database and blockchain configuration
- Establishes WebSocket connection to Ethereum node
- Validates required configuration

### 2. Block Listening
- Subscribes to new block events via WebSocket
- Logs block numbers as they arrive
- Handles connection errors and reconnects

### 3. Contract Event Listening
- Sets up filter for specified smart contract address
- Listens for all events emitted by the contract
- Parses raw logs into structured data

### 4. Data Processing
- Converts BigInt values to strings for JSON serialization
- Formats event arguments into readable structure
- Logs event details for debugging

### 5. Database Storage
- Creates new Event records in PostgreSQL
- Stores event name, contract address, block number, and transaction hash
- Saves event arguments as JSON
- Handles database errors gracefully

## Example Output

The indexer will output logs like:

```Connected to blockchain. Current block: 15234567
 New block received: 15234568
 Listening for events on contract: 0xYourContractAddressHere
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