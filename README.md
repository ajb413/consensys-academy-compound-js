# Consensys Academy 2021 Compound.js Workshop Demo

This repository contains a very basic UI that uses the Compound Protocol. The app enables users to earn interest on their crypto assets by supplying them to the protocol.

The app currently supports ETH and USDC. The app runs a Hardhat fork of Ethereum mainnet and seeds assets in the first account in the specified mnemonic.

If you do not have a JSON RPC provider URL, head over to [alchemy.com](alchemy.com) to get one for free.

To run the web app locally, set these 2 environment variables and run the 2 commands:
```bash
## configure these environment variables WITH YOUR OWN DEV SETTINGS!
export MAINNET_PROVIDER_URL="https://eth-mainnet.alchemyapi.io/v2/__KEY_HERE__"
export DEV_ETH_MNEMONIC="clutch captain shoe...."

## to run the app
npm install
npm start
```

For more documentation, developer quick start guides, and open source examples, head over to https://compound.finance/docs/.
