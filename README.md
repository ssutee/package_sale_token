# Package Sale Token project

## Install
```bash
yarn
```

## Configure
Create a `.env` file
```bash
cp .env.example .env
```
Fill in the required information

## Compile
```bash
npx hardhat compile
```

## Test
```bash
npx hardhat test
```

## Deploy on BSC testnet
```bash
npx hardhat deploy --network bsc-testnet
```

## Verify on BSC testnet
```bash
npx hardhat --network bsc-testnet etherscan-verify --solc-input --license <YOUR-LICENSE-SPDX-CODE> 
```

## Deploy on BSC mainnet
```bash
npx hardhat deploy --network bsc
```

## Verify on BSC mainnet
```bash
npx hardhat --network bsc etherscan-verify --solc-input --license <YOUR-LICENSE-SPDX-CODE> 
```