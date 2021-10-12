const express = require('express');
const path = require('path');
const { TASK_NODE_CREATE_SERVER } = require('hardhat/builtin-tasks/task-names');
const hre = require('hardhat');
const Compound = require('@compound-finance/compound-js');
const erc20 = require('./abi/erc20.abi.json');
const Web3 = hre.Web3;
const web3 = new Web3(hre.network.provider);

// Set up localhost fork with Hardhat
(async function () {
  console.log('Running a hardhat local fork of mainnet...\n');

  const jsonRpcServer = await hre.run(TASK_NODE_CREATE_SERVER, {
    hostname: 'localhost',
    port: 8545,
    provider: hre.network.provider,
  });

  await jsonRpcServer.listen();

  // Set up web app with Express
  const webApp = express();
  webApp.use('/', express.static(path.join(__dirname, 'public')));
  webApp.listen(8080, () => {
    console.log(`Example app listening at http://localhost:8080\n`)
  });

  // Seed first account with ERC-20 tokens on localhost
  const assetsToSeed = ['USDC', 'UNI'];
  const seedRequests = [];
  assetsToSeed.forEach((asset) => { seedRequests.push(seed(asset)) });
  await Promise.all(seedRequests);
})().catch(console.error)

// Moves tokens from cToken contracts to the localhost address
async function seed(asset) {
  const underlyingContract = new web3.eth.Contract(erc20, Compound.util.getAddress(asset));
  const cTokenContract = new web3.eth.Contract(erc20, Compound.util.getAddress('c' + asset));
  const accounts = await web3.eth.getAccounts();

  // Impersonate this address (only works in local testnet)
  console.log('Impersonating address on localhost... ', Compound.util.getAddress('c' + asset));
  await hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [ Compound.util.getAddress('c' + asset) ],
  });

  // 50 tokens
  const numbTokensToMint = (50 * Math.pow(10, Compound.decimals[asset])).toString();

  await underlyingContract.methods.transfer(accounts[0], numbTokensToMint).send({ 
    from: Compound.util.getAddress('c' + asset),
    gasPrice: web3.utils.toHex(0),
  });

  console.log('Local test account successfully seeded with ' + asset);
  const balanceOf = await underlyingContract.methods.balanceOf(accounts[0]).call();

  const tokens = +balanceOf / Math.pow(10, Compound.decimals[asset]);
  console.log(asset + ' amount in first localhost account wallet:', tokens);
}
