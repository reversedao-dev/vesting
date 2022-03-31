import { Button } from "@chakra-ui/button";
import { Box, Center, Container, Flex } from "@chakra-ui/layout";
import { Tag } from "@chakra-ui/tag";
import React, { useEffect, useState, useContext } from "react";

//Utils
import { getVestingFactoryContract } from "./contract";
import { abbreviateAddress } from "./utils";
import VestingInterface from "./VestingInterface";
import { FACTORY_CONTRACT_ADDRESS, REQUIRED_CHAIN_ID } from "./config";
import Web3Context from "./utils/Web3Context/context";
import ERCUtils from "./utils/Web3Context/erc.utils";

function App() {
  const Web3ContextProvider = useContext(Web3Context);
  const { provider, network } = Web3ContextProvider;
  const { getSigner, connectWallet } = ERCUtils;
  const [contractAddr, setContractAddr] = useState(null);
  const [isError, setIsError] = useState({
    status: false,
    message: null,
    severity: ''
  });

  useEffect(() => {
    if (provider) {
      let SUPPORTED_NETWORK_ID = [1];
      const supportedChainId = SUPPORTED_NETWORK_ID.indexOf(network) === -1; //If network not match
      if (supportedChainId) {
        setIsError({
          status: true,
          message: `Incorrect network. Your current chain Id is ${network}, ${REQUIRED_CHAIN_ID} is needed.`,
          severity: 'warning'
        }); //valid chain set to Kovan
      } else {
        setIsError({ status: false, message: null});
      }
    }
  }, [provider, network]);

  useEffect(() => {
    let SUPPORTED_NETWORK_ID = [1];
    if (SUPPORTED_NETWORK_ID.includes(network) && provider.length>0) {
        console.log('getting address')
        getAddress(provider);
    }
  }, []);

  const getAddress = async (currentSignerAddress) => {
    // FactoryContractAddress
    const signer = await getSigner();
    const factoryContract = await getVestingFactoryContract(
      signer,
      FACTORY_CONTRACT_ADDRESS
    );
    const vestingAddress = await factoryContract.getVestingAddress({
      from: currentSignerAddress,
    });
    setContractAddr(vestingAddress);
  };

  return (
    <Container height="100vh">
      <Flex direction="column" height="100%" width="100%">
        <Center p={5}>
          <Box mr={2}>Your Wallet:</Box>

          {!provider.length > 0 ? (
            <Button colorScheme="blue" onClick={connectWallet}>
              Connect Metamask
            </Button>
          ) : (
            <Tag colorScheme="teal">{abbreviateAddress(provider)}</Tag>
          )}
        </Center>

        <Center>
          {isError.status && provider.length > 0 &&
           <p className={`message-color-${isError.severity}`}>{isError.message}</p>}
        </Center>

        {provider.length > 0 &&
          (contractAddr === "0x0000000000000000000000000000000000000000" ||
            !contractAddr) &&
          <p>Your address does not have a vesting contract! Please make sure your network and metamask address are correct.</p>}

        {provider.length > 0 && (
          <Flex flexGrow={1}>
            <VestingInterface
              provider={provider}
              network={network}
              vestingContractAddress={contractAddr ? contractAddr : ""}
            />
          </Flex>
        )}
      </Flex>
    </Container>
  );
}

export default App;
