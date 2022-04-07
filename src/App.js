import { Button } from "@chakra-ui/button";
import { Box, Center, Container, Flex } from "@chakra-ui/layout";
import { Tag } from "@chakra-ui/tag";
import React, { useEffect, useState, useContext } from "react";

//Utils
import { getVestingFactoryContract } from "./contract";
import { abbreviateAddress } from "./utils";
import VestingInterface from "./components/VestingInterface";
import { FACTORY_CONTRACT_ADDRESS, REQUIRED_CHAIN_ID } from "./config";
import Web3Context from "./utils/Web3Context/context";
import ERCUtils from "./utils/Web3Context/erc.utils";
import MetamaskLoadingScreen from "./components/MetamaskLoadingScreen";

function App() {
  const Web3ContextProvider = useContext(Web3Context);
  const { provider, network } = Web3ContextProvider;
  const { customNetworkName, getSigner, connectWallet } = ERCUtils;
  const [contractAddr, setContractAddr] = useState(null);
  const [compoBuffering, setCompoBuffering] = useState(false);
  const [isError, setIsError] = useState({
    status: false,
    message: null,
    severity: "",
  });

  useEffect(() => {
    if (provider.length > 0) {
      let SUPPORTED_NETWORK_ID = [97];
      const supportedChainId = SUPPORTED_NETWORK_ID.indexOf(network) === -1; //If network not match
      if (supportedChainId) {
        setIsError({
          status: true,
          message: `Incorrect network. Your current chain Id is ${network}, ${REQUIRED_CHAIN_ID} is needed.`,
          severity: "warning",
        }); //valid chain set to BSC Testnet by default
      } else {
        setIsError({ status: false, message: null });
      }
    }
  }, [provider, network]);

  useEffect(() => {
    let SUPPORTED_NETWORK_ID = [97];
    if (SUPPORTED_NETWORK_ID.includes(network) && provider.length > 0) {
      // console.log(`getting address on ${network} network`);
      setCompoBuffering(true);
      getAddress(provider);
      setCompoBuffering(false);
   
    }
  }, [provider, network]);  

  const getAddress = async (currentSignerAddress) => {
  
    const signer = await getSigner();
    const factoryContract = await getVestingFactoryContract(
      signer,
      FACTORY_CONTRACT_ADDRESS
    );
    const vestingAddress = await factoryContract.getVestingAddress({
      from: currentSignerAddress,
    });
    if(vestingAddress) setContractAddr(vestingAddress);  
  };
 
  return (
    compoBuffering ? <MetamaskLoadingScreen compoBuffering={compoBuffering}/> 
    :
    <Container height="100vh">
      <Flex direction="column" height="100%" width="100%">
        <Center p={5}>
          <Box mr={2}>Your Wallet:</Box>
          {!provider.length > 0 ? (
            <div>
              <Button colorScheme="blue" onClick={connectWallet}>
                Connect Metamask
              </Button>
            </div>
          ) : (
            <>
              <Tag style={{ marginRight: 10 }} colorScheme="teal">{abbreviateAddress(provider)}</Tag>

              <Tag colorScheme="linkedin">{`Network: ${customNetworkName(network)}`}</Tag>
            </>
          )}
        </Center>

        <Center>
          {isError.status && provider.length > 0 && (
            <p className={`message-color-${isError.severity}`}>
              {isError.message}
            </p>
          )}
        </Center>

        {provider.length > 0 && contractAddr === "0x0000000000000000000000000000000000000000" ?
          <p>
            Your address does not have a vesting contract! Please make sure your network or metamask address are correct.
          </p>
          : 
          <Flex flexGrow={1}>
            {provider.length > 0 &&
              <VestingInterface
                provider={provider}
                network={network}
                compoBuffering={compoBuffering}
                setCompoBuffering={setCompoBuffering}
                vestingContractAddress={contractAddr} />}
          </Flex>}
      </Flex>
    </Container>
    )
}

export default App;
