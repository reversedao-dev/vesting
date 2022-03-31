import { Fragment } from "react";

export const networkMapping = {
    1: {
      param: {
        chainId: '0x1',
        chainName: 'Ethereum Main Network (Mainnet)',
      },
      meta: {
        svg: () => <Fragment><path fill="#343434" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" /><path fill="#8C8C8C" d="M127.962 0L0 212.32l127.962 75.639V154.158z" /><path fill="#3C3C3B" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" /><path fill="#8C8C8C" d="M127.962 416.905v-104.72L0 236.585z" /><path fill="#141414" d="M127.961 287.958l127.96-75.637-127.96-58.162z" /><path fill="#393939" d="M0 212.32l127.96 75.638v-133.8z" /></Fragment>,
        name: `Ethereum`
      }
    },
    42: {
      param: {
        chainId: '0x2a',
        chainName: 'Kovan Test Network',
      },
      meta: {
        svg: () => <Fragment><path fill="#343434" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" /><path fill="#8C8C8C" d="M127.962 0L0 212.32l127.962 75.639V154.158z" /><path fill="#3C3C3B" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" /><path fill="#8C8C8C" d="M127.962 416.905v-104.72L0 236.585z" /><path fill="#141414" d="M127.961 287.958l127.96-75.637-127.96-58.162z" /><path fill="#393939" d="M0 212.32l127.96 75.638v-133.8z" /></Fragment>,
        name: `Ethereum`
      }
    },
    97:{
      param: {
          chainId: '0x61',
          chainName: 'Binance Smart Chain Testnet',
          nativeCurrency: {
            name: 'Binance',
            symbol: 'BNB', 
            decimals: 18
          },
          blockExplorerUrls: ['https://testnet.bscscan.com'],
          rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
        }
      },
      56:{
        param: {
            chainId: '0x38',
            chainName: 'Binance Smart Chain',
            nativeCurrency: {
              name: 'Binance',
              symbol: 'BNB', 
              decimals: 18
            },
            blockExplorerUrls: ['https://bscscan.com'],
            rpcUrls: ['https://bsc-dataseed.binance.org/'],
          }
        },
      137: {
      param: {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        nativeCurrency: {
          name: 'matic',
          symbol: 'MATIC',
          decimals: 18
        },
        rpcUrls: ['https://polygon-rpc.com/'],
        blockExplorerUrls: ['https://polygonscan.com/']
      },
      meta: {
        svg: () => <Fragment><path d="M197.648 68.5918C192.815 65.7437 186.533 65.7437 181.218 68.5918L143.524 90.4273L117.912 104.668L80.219 126.503C75.3865 129.351 69.1043 129.351 63.7886 126.503L33.8273 109.414C28.9948 106.566 25.6121 101.345 25.6121 95.6488V61.9462C25.6121 56.25 28.5116 51.0285 33.8273 48.1804L63.3053 31.5665C68.1378 28.7184 74.42 28.7184 79.7357 31.5665L109.214 48.1804C114.046 51.0285 117.429 56.25 117.429 61.9462V83.7817L143.041 69.0665V47.2311C143.041 41.5348 140.142 36.3133 134.826 33.4652L80.219 2.13608C75.3865 -0.712026 69.1043 -0.712026 63.7886 2.13608L8.2152 33.4652C2.89948 36.3133 0 41.5348 0 47.2311V110.364C0 116.06 2.89948 121.282 8.2152 124.13L63.7886 155.459C68.621 158.307 74.9033 158.307 80.219 155.459L117.912 134.098L143.524 119.383L181.218 98.0222C186.05 95.1741 192.332 95.1741 197.648 98.0222L227.126 114.636C231.958 117.484 235.341 122.706 235.341 128.402V162.104C235.341 167.801 232.442 173.022 227.126 175.87L197.648 192.959C192.815 195.807 186.533 195.807 181.218 192.959L151.74 176.345C146.907 173.497 143.524 168.275 143.524 162.579V140.744L117.912 155.459V177.294C117.912 182.99 120.812 188.212 126.127 191.06L181.701 222.389C186.533 225.237 192.815 225.237 198.131 222.389L253.705 191.06C258.537 188.212 261.92 182.99 261.92 177.294V114.161C261.92 108.465 259.02 103.244 253.705 100.396L197.648 68.5918Z" fill="#8247E5"></path></Fragment>,
        name: `Polygon`
      }
    }
}