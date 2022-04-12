import React, { useEffect, useState } from 'react';
import Web3Context from "./context.jsx"
import ERCUtils from "./erc.utils";

const Web3Provider = ({children}) => {
    const [ provider, setProvider ] = useState({'metamask@erc': []});
    const [ networkId, setNetworkId ] = useState({name: 'default', chainId: -1 })
    
    useEffect(() => {
        if (window?.ethereum ){
            window.ethereum.request({ method: 'eth_accounts' }).then((address)=> {
                if (address.length !== 0) {  
                    connectERCProvider();
                }
            });
    
            window.ethereum.on("chainChanged", async (_chainId) => {
                console.log(`ChainId change to ${_chainId}`)
                getCurrentChainId()
            });
    
            window.ethereum.on('accountsChanged', (acc) => {
                console.log('listening to accountsChanged event', acc)
                setProvider({'metamask@erc': acc[0]});
                getCurrentChainId();
            });
    
        }
        return () => window?.ethereum.removeAllListeners();
       
}, [])

useEffect(() => {
    if (window?.ethereum){
        window.ethereum.request({ method: 'eth_accounts' }).then((result)=> {
            // console.log(`Request to connect`, result)
            if (result.length !== 0) {     
                getCurrentChainId();
            }
        });
    }
}, [networkId]);

    const getCurrentChainId = async () => {
        const chainInfo = await ERCUtils.getChainId();
        if (!chainInfo) return; // do not update chainID if metamask is not connected
        const { chainId } = chainInfo;
        setNetworkId(chainId)
    }

    const connectERCProvider = async () => {
        if (window.ethereum?.isMetaMask) {
            let isConnected = await ERCUtils.connectWallet();
            console.log('isConnected to address:', isConnected)
            if (isConnected) {
                // console.log("setting provider to:", isConnected[0]);
                setProvider({'metamask@erc': isConnected[0]});
            }
            return isConnected
        } 
    }


    const connectProvider = async (network) => {
        if (network === 'erc'){
            return await connectERCProvider();
        }
    };

    const providerValue = {
        connect: connectProvider,
        provider: provider["metamask@erc"] ? provider["metamask@erc"] : provider,
        network: networkId,
    };

    return (
        <Web3Context.Provider value={providerValue}>
                {children}
        </Web3Context.Provider>
    )
};

export default Web3Provider;