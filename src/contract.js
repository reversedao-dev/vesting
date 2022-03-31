import { ethers } from 'ethers';

const TokenVestingJSON = require('./contracts/TokenVesting.json');
const RefinableTokenJSON = require('./contracts/RefinableToken.json');
const TokenVestingFactoryJSON = require('./contracts/TokenVestingFactory.json');

export async function getSigner() {
  if (window?.ethereum || typeof window.web3 !== undefined) {
    const signer = await new ethers.providers.Web3Provider(window.ethereum, "any").getSigner();
    return signer
  }
};

export async function getVestingContract(provider, address) {
  return new ethers.Contract(address, TokenVestingJSON.abi, provider);
}

export async function getTokenContract(provider, address) {
  return new ethers.Contract(address, RefinableTokenJSON.abi, provider);
}

export async function getVestingFactoryContract(provider, address) {
  return new ethers.Contract(address, TokenVestingFactoryJSON.abi, provider);
}

export function encodeReleaseTokens(tokenAddress) {
  const contract = new ethers.utils.Interface(TokenVestingJSON.abi);
  return contract.encodeFunctionData('release', [tokenAddress]);
}
