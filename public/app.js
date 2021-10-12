const compound = new Compound(window.ethereum);

const ethApyElement = document.getElementById('eth-apy');
const ethSupplyInput = document.getElementById('eth-supply');
const ethSupplyButton = document.getElementById('eth-supply-button');
const ethRedeemInput = document.getElementById('eth-redeem');
const ethRedeemButton = document.getElementById('eth-redeem-button');
const usdcApyElement = document.getElementById('usdc-apy');
const usdcSupplyInput = document.getElementById('usdc-supply');
const usdcSupplyButton = document.getElementById('usdc-supply-button');
const usdcRedeemInput = document.getElementById('usdc-redeem');
const usdcRedeemButton = document.getElementById('usdc-redeem-button');
const enableEthereumButton = document.getElementById('enable-button');

enableEthereumButton.onclick = async () => {
  await ethereum.request({ method: 'eth_requestAccounts' });
};

ethSupplyButton.onclick = async () => {
  const amount = +ethSupplyInput.value;
  await supply(Compound.ETH, amount);
};

ethRedeemButton.onclick = async () => {
  const amount = +ethRedeemInput.value;
  await redeem(Compound.cETH, amount);
};

usdcSupplyButton.onclick = async () => {
  const amount = +usdcSupplyInput.value;
  await supply(Compound.USDC, amount);
};

usdcRedeemButton.onclick = async () => {
  const amount = +usdcRedeemInput.value;
  await redeem(Compound.cUSDC, amount);
};

async function supply(asset, amount) {
  if (!isNaN(amount) && amount !== 0) {
    try {
      const trx = await compound.supply(asset, amount);
      console.log(asset, 'Supply', amount, trx);
      console.log('Transaction Hash', trx.hash);
    } catch (err) {
      alert(JSON.stringify(err));
    }
  }
}

async function redeem(asset, amount) {
  if (!isNaN(amount) && amount !== 0) {
    try {
      const trx = await compound.redeem(asset, amount);
      console.log(asset, 'Redeem', amount, trx);
      console.log('Transaction Hash', trx.hash);
    } catch (err) {
      alert(JSON.stringify(err));
    }
  }
}

async function calculateApy(asset) {
  const srpb = await Compound.eth.read(
    Compound.util.getAddress('c' + asset),
    'function supplyRatePerBlock() returns (uint256)',
    [],
    { provider: window.ethereum }
  );

  const mantissa = Math.pow(10, 18);
  const blocksPerDay = parseInt(60 * 60 * 24 / 13.15); // ~13.15 second block time
  const daysPerYear = 365;

  const supplyApy = (((Math.pow((+(srpb.toString()) / mantissa * blocksPerDay) + 1, daysPerYear))) - 1) * 100;
  return supplyApy;
}

window.addEventListener('load', async (event) => {
  const ethApy = await calculateApy('ETH');
  ethApyElement.innerText = ethApy.toFixed(2);
  const usdcApy = await calculateApy('USDC');
  usdcApyElement.innerText = usdcApy.toFixed(2);
});