import React, { Fragment, useEffect, useState } from 'react';
import moment from 'moment';

import {
  getVestingContract,
  getTokenContract,
} from '../contract';
import { abbreviateAddress, formatTokenNum } from '../utils';
import { TOKEN_CONTRACT_ADDRESS, EXPLORER_URL } from '../config';

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
} from '@chakra-ui/react';
import ERCUtils from "../utils/Web3Context/erc.utils";
import MetamaskLoadingScreen from "../components/MetamaskLoadingScreen";

function VestingInterface({ provider, network , vestingContractAddress, compoBuffering, setCompoBuffering }) {

  const { getSigner } = ERCUtils;
  const [vestingState, setVestingState] = useState({});
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    let SUPPORTED_NETWORK_ID = [97];
    if (vestingContractAddress && SUPPORTED_NETWORK_ID.includes(network) && provider.length > 0) {
        // console.log(`Getting data on ${network} network`)
        setCompoBuffering(true)
        getData(vestingContractAddress);
        setCompoBuffering(false)       
        return () => {};
    };
  
  }, [network, provider, vestingContractAddress]);

  const getData = async (addr) => {
    const signer = await getSigner();
    const vestingContract = await getVestingContract(signer, addr);
    const tokenContract = await getTokenContract(signer, TOKEN_CONTRACT_ADDRESS);      

    const symbol = await tokenContract.symbol();
    const start = (await vestingContract.getStart()).toNumber();

    if(start > 0){
      const duration = (await vestingContract.getDuration()).toNumber();
      const cliff = (await vestingContract.getCliff()).toNumber();
      const released = await vestingContract.getReleased(TOKEN_CONTRACT_ADDRESS);
      const balance = await tokenContract.balanceOf(vestingContractAddress);
      const total = released.add(balance); 
      const vested = await vestingContract.getVestedAmount(TOKEN_CONTRACT_ADDRESS);
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
    }
  };
  const claimTokens = async () => {
    try{
      setIsClaiming(true);
      const signer = await getSigner();
      const tokenVestingContract = await getVestingContract(signer, vestingContractAddress);
      const releaseResult = await tokenVestingContract.release(TOKEN_CONTRACT_ADDRESS);
      console.log({releaseResult})
      setIsClaiming(false);
    }catch(err){
      console.log("Error in claiming tokens", err)
    }
  }

  return (

    vestingState.total === 0 ? (
      <Container height="100vh" className="VestingInfaceRoot">
        <Center>
          {`Vesting has not started yet. The vesting start date is ${moment((vestingState.start) * 1000).format('YYYY/MM/DD HH:mm')}. 
          The ${vestingState.symbol} tokens will appear here soon.`}
        </Center>
      </Container>
    ) :
    compoBuffering ? <MetamaskLoadingScreen compoBuffering={compoBuffering}/> 
    :
    <Box>    
      <br/>
      <>
        <Heading size="md" mb={5}>
          Vesting Details: 
        </Heading>
        <Box mb={5}>
          {vestingState.vested > 0 ? (
            <>
              <Stack spacing={5}>
                <Progress value={vestingState.vested.mul(100).div(vestingState.total).toNumber()}/>
              </Stack>
              <Text align="center">
                <span>{formatTokenNum(vestingState.vested, vestingState.symbol)} / {formatTokenNum(vestingState.total, vestingState.symbol)}</span>
              </Text>
            </>
          ) : (
            <>
              <Progress value={'0'}/>
              <Text align="center">
                <span>{formatTokenNum(vestingState.vested, vestingState.symbol)} / {formatTokenNum(vestingState.total, vestingState.symbol)}</span>
              </Text>
            </>
          )}
        </Box>
        <Table
          variant="simple"
          size="md"
          borderRadius="12px"
          borderWidth="1px"
          style={{ borderCollapse: 'initial', tableLayout: 'fixed' }}
        >
          <Tbody>
            <Tr>
              <Td>
                <strong>Token Contract Address</strong>
              </Td>
              <Td>
              {EXPLORER_URL && TOKEN_CONTRACT_ADDRESS && 
                <Link
                  color="teal.500"
                  href={`${EXPLORER_URL}/address/${TOKEN_CONTRACT_ADDRESS}`}
                  isExternal
                >
                  {abbreviateAddress(TOKEN_CONTRACT_ADDRESS)}
                </Link>}
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Vesting Contract Address</strong>
              </Td>
              <Td>
              {EXPLORER_URL && vestingContractAddress && 
                <Link
                  color="teal.500"
                  href={`${EXPLORER_URL}/address/${vestingContractAddress}`}
                  isExternal
                >
                  {abbreviateAddress(vestingContractAddress)}
                </Link>}
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Start date</strong>
              </Td>
              <Td>
                {vestingState.start
                  ? moment(vestingState.start * 1000).format('YYYY/MM/DD HH:mm')
                  : 'N/A'}
              </Td>
            </Tr>

            {vestingState.cliff === vestingState.start ? (''
            ) : (
              <Tr>
                <Td>
                  <strong>Cliff date</strong>
                </Td>
                <Td>
                  {vestingState.cliff
                    ? moment(vestingState.cliff * 1000).format('YYYY/MM/DD HH:mm')
                    : 'N/A'}
                </Td>
              </Tr>
            )}

            <Tr>
              <Td>
                <strong>End date</strong>
              </Td>
              <Td>
                {vestingState.start
                  ? moment(
                      (vestingState.start + vestingState.duration) * 1000
                    ).format('YYYY/MM/DD HH:mm')
                  : 'N/A'}
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Total tokens</strong>
              </Td>
              <Td>{formatTokenNum(vestingState.total, vestingState.symbol)}</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Already vested</strong>
              </Td>
              <Td>{formatTokenNum(vestingState.vested, vestingState.symbol)}</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Remaining to vest</strong>
              </Td>
              <Td>
                {formatTokenNum(vestingState.remaining, vestingState.symbol)}
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Already claimed</strong>
              </Td>
              <Td>
                {formatTokenNum(vestingState.released, vestingState.symbol)}
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Available to Claim</strong>
              </Td>
              <Td>
                {formatTokenNum(vestingState.releasable, vestingState.symbol)}{' '}
                <Button
                  onClick={claimTokens}
                  colorScheme="green"
                  ml={5}
                  isDisabled={isClaiming}
                  // isDisabled={isClaiming || (vestingState?.releasable?.toNumber()) === 0}
                >
                  Claim
                </Button>
              </Td>
            </Tr>
          </Tbody>
        </Table>
        </>
      </Box>
  );
}

export default VestingInterface;

