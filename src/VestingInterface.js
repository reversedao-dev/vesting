import React, { useEffect, useState } from 'react';
import moment from 'moment';

import {
  getVestingContract,
  getTokenContract,
  encodeReleaseTokens,
} from './contract';
import { abbreviateAddress, formatTokenNum } from './utils';
import { TOKEN_CONTRACT_ADDRESS, EXPLORER_URL } from './config';

import {
  Box,
  Button,
  Container,
  Center,
  Heading,
  Progress,
  Table,
  Tbody,
  Td,
  Tr,
  Text,
  Link,
} from '@chakra-ui/react';

// import { FACTORY_CONTRACT_ADDRESS, REQUIRED_CHAIN_ID } from "./config";
import ERCUtils from "./utils/Web3Context/erc.utils";
// 
function VestingInterface({ provider, network , vestingContractAddress }) {
  const { getSigner } = ERCUtils;

  const [vestingState, setVestingState] = useState({});
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    let SUPPORTED_NETWORK_ID = [42];
    if (SUPPORTED_NETWORK_ID.includes(network) && provider.length>0) {
      console.log(`Getting data`)
      // getData();
      };
  }, [network, provider]);

  const getData = async () => {
    const signer = await getSigner();
    // VestingAddress
    const vestingContract = await getVestingContract(signer, vestingContractAddress);

    //TokenAddress
    const tokenContract = await getTokenContract(signer, TOKEN_CONTRACT_ADDRESS);      
    const symbol = await tokenContract.symbol();
    const start = (await vestingContract.getStart()).toNumber();
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
  };

  const claimTokens = async () => {
    setIsClaiming(true);

    try {
      const data = encodeReleaseTokens(TOKEN_CONTRACT_ADDRESS);

      const transactionParameters = {
        gas: '0x30D40', // customizable by user during MetaMask confirmation.
        to: vestingContractAddress, //vestingContractAddress, // Required except during contract publications.
        from: provider, // must match user's active address.
        value: '0x00', // Only required to send ether to the recipient from the initiating external account.
        data,
      };

      // txHash is a hex string
      // As with any RPC call, it may throw an error
      await window?.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
    } catch (err) {
      console.error('Error in claiming tokens', err);
    }
    setIsClaiming(false);
  };

  return (
    vestingState.total === 0? (
      <Container height="100vh">
        <Center>
          {`Vesting has not started yet. The vesting start date is ${moment((vestingState.start) * 1000).format('YYYY/MM/DD HH:mm')}. The ${vestingState.symbol} tokens will appear here soon.`}
        </Center>
      </Container>
    ) :
    <Box>
      <br/>
      <Heading size="md" mb={5}>
        Vesting Details
      </Heading>
      <Box mb={5}>
        {vestingState.vested ? (
          <>
            <Progress
              value={vestingState.vested
                .mul(100)
                .div(vestingState.total)
                .toNumber()}
            />
            <Text align="center">
              {formatTokenNum(vestingState.vested, vestingState.symbol)} /{' '}
              {formatTokenNum(vestingState.total, vestingState.symbol)}
            </Text>
          </>
        ) : (
          ''
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
              >{abbreviateAddress(vestingContractAddress)}
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
                : 'loading...'}
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
                  : 'loading...'}
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
                : 'loading...'}
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
              >
                Claim
              </Button>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
}

export default VestingInterface;
