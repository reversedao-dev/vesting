import React, { useEffect, useState } from "react";
import moment from "moment";

import { getVestingContract, getTokenContract } from "../contract";
import { abbreviateAddress, formatTokenNum } from "../utils";
import { TOKEN_CONTRACT_ADDRESS, EXPLORER_URL } from "../config";

import {
  Box,
  Button,
  Container,
  Center,
  Heading,
  Progress,
  Stack,
  Table,
  Tbody,
  Td,
  Tr,
  Text,
  Link,
} from "@chakra-ui/react";

import ERCUtils from "../utils/Web3Context/erc.utils";
import MetamaskLoadingScreen from "../components/MetamaskLoadingScreen";

function VestingInterface({
  provider,
  network,
  vestingContractAddress,
  compoBuffering,
  setCompoBuffering,
}) {
  const { getSigner } = ERCUtils;
  const [vestingState, setVestingState] = useState({});
  const [isClaiming, setIsClaiming] = useState(false);
  const [isError, setIsError] = useState({
    status: false,
    message: null,
    severity: "",
  });

  useEffect(() => {
    let SUPPORTED_NETWORK_ID = [97];
    if (
      vestingContractAddress &&
      SUPPORTED_NETWORK_ID.includes(network) &&
      provider.length > 0
    ) {
      getData(vestingContractAddress);
      return () => {};
    }
  }, [network, provider, vestingContractAddress]);

  const getData = async (addr) => {
    try {
      setCompoBuffering(true);
      const signer = await getSigner();
      const vestingContract = await getVestingContract(signer, addr);
      const tokenContract = await getTokenContract(
        signer,
        TOKEN_CONTRACT_ADDRESS
      );
      const symbol = await tokenContract.symbol();
      const start = (await vestingContract.getStart()).toNumber();

      if (start > 0) {
        const duration = (await vestingContract.getDuration()).toNumber();
        const cliff = (await vestingContract.getCliff()).toNumber();
        const released = await vestingContract.getReleased(
          TOKEN_CONTRACT_ADDRESS
        );
        const balance = await tokenContract.balanceOf(vestingContractAddress);
        const total = released.add(balance);
        const vested = await vestingContract.getVestedAmount(
          TOKEN_CONTRACT_ADDRESS
        );
        const remaining = total.sub(vested);
        const releasable = vested.sub(released);

        setVestingState({
          start,
          duration,
          released,
          vested,
          balance,
          releasable,
          symbol,
          cliff,
          total,
          remaining,
        });
        setCompoBuffering(false);
      }
    } catch (err) {
      console.log("Error in getting data", err);
      setCompoBuffering(false);
    }
  };
  const claimTokens = async () => {
    try {
      setIsClaiming(true);
      const signer = await getSigner();
      const tokenVestingContract = await getVestingContract(
        signer,
        vestingContractAddress
      );
      const releaseResult = await tokenVestingContract.release(
        TOKEN_CONTRACT_ADDRESS
      );
      console.log({ releaseResult });
      setIsClaiming(false);
    } catch (err) {
      _rpcErrHandler(err);
      console.log("Error in claiming tokens", err);
    }
  };

  const _rpcErrHandler = async (err) => {
    let msg;
    if (err) {
      switch (err.code) {
        case -32603:
          msg = err.data.message;
          break;
        case 4001:
          msg = `You have denied the transaction`;
          break;
        default:
          break;
      }
    }
    setIsError({ status: true, message: msg, severity: "error" });
    setIsClaiming(false);
  };

  return compoBuffering ? (
    <MetamaskLoadingScreen compoBuffering={compoBuffering} />
  ) : vestingState.total === 0 ? (
    <Container height="100vh" className="VestingInfaceRoot">
      <Center>
        {`Vesting has not started yet. The vesting start date is ${moment(
          vestingState.start * 1000
        ).format("YYYY/MM/DD HH:mm")}. 
          The ${vestingState.symbol} tokens will appear here soon.`}
      </Center>
    </Container>
  ) : (
    <Box>
      <Center>
        {isError.status && (
          <p className={`message-color-${isError.severity}`}>
            {isError.message === "execution reverted: TokenVesting: no tokens are due" ?
             "TOKENVESTING: NO TOKEN CAN BE CLAIMED" 
             : isError.message.toUpperCase()}
          </p>
        )}
      </Center>
      <>
        <Heading size="md" mt={3} mb={4}>
          Vesting Details:
        </Heading>
        <Box mb={5}>
          {vestingState.vested > 0 ? (
            <>
              <Stack spacing={5}>
                <Progress
                  value={vestingState.vested
                    .mul(100)
                    .div(vestingState.total)
                    .toNumber()}
                />
              </Stack>
              <Text align="center">
                <span className="flexRow">
                {formatTokenNum(false,vestingState.vested,vestingState.symbol)+" "}/{" "+formatTokenNum(false,vestingState.total,vestingState.symbol)}
                </span>
              </Text>
            </>
          ) : (
            <>
              <Progress value={"0"}/>
              <Text align="center">
              {vestingState.symbol ? <span className="flexRow">N/A{" "+vestingState.symbol}</span> : " loading..."}
              </Text>
            </>
          )}
        </Box>
        <Table
          variant="simple"
          size="md"
          borderRadius="12px"
          borderWidth="1px"
          style={{ borderCollapse: "initial", tableLayout: "fixed" }}
        >
          <Tbody>
            <Tr>
              <Td>
                <strong>Token Contract Address</strong>
              </Td>
              <Td>
                <Link
                  color="teal.500"
                  href={`${EXPLORER_URL}/address/${TOKEN_CONTRACT_ADDRESS}`}
                  isExternal
                >
                  {abbreviateAddress(TOKEN_CONTRACT_ADDRESS)}
                </Link>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Vesting Contract Address</strong>
              </Td>
              <Td>
                {vestingContractAddress && (
                  <Link
                    color="teal.500"
                    href={`${EXPLORER_URL}/address/${vestingContractAddress}`}
                    isExternal
                  >
                    {abbreviateAddress(vestingContractAddress)}
                  </Link>
                )}
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Start date</strong>
              </Td>
              <Td>
                {vestingState.start
                  ? moment(vestingState.start * 1000).format("YYYY/MM/DD HH:mm")
                  : "N/A"}
              </Td>
            </Tr>
              <Tr>
                <Td><strong>Cliff date</strong></Td>
                <Td>
                {vestingState.cliff === vestingState.start ? (
                "N/A" ) : (
                vestingState.cliff 
                ? moment(vestingState.cliff * 1000).format("YYYY/MM/DD HH:mm") : "N/A")}
                </Td>
              </Tr>
           
            <Tr>
              <Td>
                <strong>End date</strong>
              </Td>
              <Td>
                {vestingState.start
                  ? moment(
                      (vestingState.start + vestingState.duration) * 1000
                    ).format("YYYY/MM/DD HH:mm")
                  : "N/A"}
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Total tokens</strong>
              </Td>
              <Td>
                {formatTokenNum(true,vestingState.total,vestingState.symbol)}
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Already vested</strong>
              </Td>
              <Td>
                {formatTokenNum(true,vestingState.vested,vestingState.symbol)}
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Remaining to vest</strong>
              </Td>
              <Td>
                {formatTokenNum(true,vestingState.remaining,vestingState.symbol)}
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Already claimed</strong>
              </Td>
              <Td>
                {formatTokenNum(true,vestingState.released,vestingState.symbol)}
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Available to Claim</strong>
              </Td>
              <Td>
                <div className="flexRow-TD">
                  <span>
                    {formatTokenNum(
                      true,
                      vestingState.releasable,
                      vestingState.symbol
                    )}
                  </span>
                  <Button
                    onClick={claimTokens}
                    colorScheme={"green"}
                    ml={4}
                    isDisabled={isClaiming}
                  >Claim
                  </Button>
                </div>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </>
    </Box>
  );
}

export default VestingInterface;
