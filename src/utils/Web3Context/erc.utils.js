import { ethers } from "ethers";
import { networkMapping } from "./config";
import UAParser from "ua-parser-js";

async function initEtherProvider() {
  let resp = await connectWallet();
  if (!resp) return false;
  return new ethers.providers.Web3Provider(window.ethereum, "any");
}

async function getSigner() {
  let provider = await initEtherProvider();
  if (!provider) return false;
  return await provider.getSigner();
}

async function getAddress() {
  let signer = await getSigner();
  if (!signer) return false;
  return await signer.getAddress();
}

async function getChainId() {
  const eth = await initEtherProvider();
  if (!eth) return null;
  let currentNetworkId = await eth.getNetwork();
  // console.log("Getting chainId", currentNetworkId);
  return currentNetworkId;
}

async function switchNetwork(chainId) {
  try {
    const data = [{ chainId: chainId }];
    const switchedNetwork = await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: data,
    });
    // console.log("Switched network status", switchedNetwork);
    return switchedNetwork;
  } catch (switchError) {
    console.log("Error in switching polygon", switchError);
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      const param = networkMapping[Number(chainId)].param;
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [param],
        });
      } catch (err) {
        console.log("Error in adding ethereum chain", err);
      }
    }
  }
}

const getTokenIcon = (token) => {
  let imgScr = "reverseDao_green_icon.png";
  switch (token) {
    // case "MARS":
    case "RADO":
      imgScr = "reverseDao_circle_icon.png";
      break;
    default:
      break;
  }
  return imgScr;
};

/* method to connect metamask
 * @returns {[string]} array of wallet address
 */
function connectWallet() {
  try {
    if (window.ethereum.isMetaMask) {
      // console.log("Connecting to wallet - (Metamask has already installed)", window.ethereum.isMetaMask)
      let resp = window.ethereum.request({
        method: "eth_requestAccounts",
        params: [{ eth_accounts: {} }],
      });
      return resp;
    } else {
      installMetamask();
    }
  } catch (err) {
    console.log("Error in connecting wallet", err);
  }
}


function installMetamask() {
  if (typeof window.ethereum !== undefined || !window.ethereum.isMetaMask) {
    try {
      const userAgent = new UAParser();
      const { name } = userAgent.getBrowser();
      let downloadLink;
      switch (name.toUpperCase()) {
        case "SAFARI": //NOT SUPPORT BY METAMASK
        case "CHROME":
          downloadLink =
            "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn";
          break;
        case "FIREFOX":
          downloadLink =
            "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/";
          break;
        default:
        break;
      }
      window.open(downloadLink, "_blank").focus();
    } catch (err) {
      console.log("Error in connecting wallet", err.message);
      return false;
    }
  }
}

function isConnected() {
  return window.ethereum.isConnected();
}

async function initContract(address, abi) {
  let signer = await getSigner();
  const contract = new ethers.Contract(address, abi, signer);
  return contract;
}

const customNetworkName = (chainId) => {
  let networkText = chainId;
  switch (chainId) {
    case 1 || "homestead":
      networkText = "ETHEREUM";
      break;
    case 97 || "bnbt":
      networkText = "BSC Testnet";
      break;
    case 56 || "bnb":
      networkText = "Binance Smart Chain Mainnet";
      break;
    case 137 || "matic":
      networkText = "Polygon Mainnet";
      break;
    default:
      break;
  }
  return String(networkText).toUpperCase();
};

const ERCUtils = {
  customNetworkName,
  getSigner,
  getAddress,
  getChainId,
  getTokenIcon,
  switchNetwork,
  connectWallet,
  initContract,
  isConnected,
};

export default ERCUtils;
