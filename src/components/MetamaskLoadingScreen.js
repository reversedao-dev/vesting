import React, { Fragment } from 'react';
import { CircularProgress } from "@material-ui/core";


export default function MetamaskLoadingScreen  (children, compoBuffering, msg='loading...') {
        return (
            compoBuffering ?
            <Fragment>
                <div style={{height: '100vh'}}>
                    <div><CircularProgress/></div>
                    <div>{msg}</div>
                </div>
            </Fragment>
            :
            children
        )
}