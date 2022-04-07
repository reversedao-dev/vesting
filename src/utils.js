import { ethers } from 'ethers';

export function formatTokenNum(vestedAmount, symbol) {
  if (!vestedAmount) return 'N/A';
  return (
    parseFloat(ethers.utils.formatEther(vestedAmount.toString(), 'ether')).toLocaleString(
      'en-US',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    ) + ` ${symbol}`
  );
}

export function abbreviateAddress(address) {
  return address.substr(0, 6) + '...' + address.substr(address.length - 4, 4);
}
