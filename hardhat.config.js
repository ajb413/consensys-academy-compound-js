require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-web3');

const providerUrl = process.env.MAINNET_PROVIDER_URL;
const developmentMnemonic = process.env.DEV_ETH_MNEMONIC;

if (!providerUrl) {
  console.error('Missing JSON RPC provider URL as environment variable `MAINNET_PROVIDER_URL`\n');
  process.exit(1);
}

if (!developmentMnemonic) {
  console.error('Missing development Ethereum account mnemonic\n');
  process.exit(1);
}

module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: providerUrl,
      },
      gasPrice: 0,
      initialBaseFeePerGas: 0,
      loggingEnabled: false,
      accounts: {
        mnemonic: developmentMnemonic,
      },
      chainId: 1, // metamask -> accounts -> settings -> networks -> localhost 8545 -> set chainId to 1
    },
  },
};