import React from 'react';
import { CircularProgress } from "@material-ui/core";
import { Container, Center } from "@chakra-ui/layout";

export default function MetamaskLoadingScreen (compoBuffering, msg='loading...') {
        return (
            compoBuffering &&
                <Container height="100vh">
                    <Center>
                        <div><CircularProgress/></div>
                    </Center>
                </Container>
        )
}