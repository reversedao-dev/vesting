import { ethers } from 'ethers';
import { Flex } from "@chakra-ui/layout";
import ERCUtils from "./utils/Web3Context/erc.utils";
const { getTokenIcon } = ERCUtils;

export function formatTokenNum(attachImg=false, vestedAmount, symbol="") {
  if (!vestedAmount || !symbol) return 'N/A';
  let vestedAmountInNumber = parseFloat(ethers.utils.formatEther(vestedAmount.toString(), 'ether')).toLocaleString('en-US', {minimumFractionDigits: 2,maximumFractionDigits: 2})

  if(!attachImg){
    return vestedAmountInNumber+" "+symbol
  }
  return (
    <>
      <Flex direction="row">{vestedAmountInNumber+" "}<img style={{marginLeft: 6}} src={getTokenIcon(symbol)} width={20} height={20} alt="token-icon"/></Flex>
    </>
    )
}

export function abbreviateAddress(address) {
  return address.substr(0, 8) + '...' + address.substr(address.length -4, 8);
}
