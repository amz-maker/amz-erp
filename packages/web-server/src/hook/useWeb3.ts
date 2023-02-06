import { MetaMaskInpageProvider } from '@metamask/providers';
import React from 'react';
import { useNavigate } from 'react-router-dom';
//import Web3 from 'web3';

export function useWeb3() {
  // const navigate = useNavigate();
  // const [ethereum, setEthereum] = React.useState<MetaMaskInpageProvider>();

  // async function getChainId() {
  //   return await window.ethereum.request({
  //     method: 'eth_chainId',
  //   });
  // }

  // async function getRequestAccounts(): Promise<string[]> {
  //   const accounts = await window.ethereum.request({
  //     // 연결이 안되어 있다면 메타마스크 내의 계정들과 연결 요청
  //     // 연결이 되었다면 메타마스크가 갖고 있는 계정들 중 사용하고 있는 계정 가져오기
  //     method: 'eth_requestAccounts',
  //   });

  //   return accounts as string[];
  // }

  // async function signing(message: string) {
  //   if (ethereum !== undefined) {
  //     const web3 = new Web3(window.ethereum as any);
  //     const account = await getRequestAccounts();
  //     const from = account[0];

  //     // Sign message with MetaMask
  //     const signature = await web3.eth.personal.sign(message, from, '');
  //     console.log('signature: ', signature);
  //     return signature;
  //   }
  // }

  // React.useEffect(() => {
  //   if (window.ethereum !== undefined) {
  //     setEthereum(window.ethereum);
  //   } else {
  //     alert('MetaMask가 설치되어 있지 않습니다.');
  //     // 메타마스크 설치 페이지로 이동
  //     navigate('https://metamask.io/');
  //   }
  // }, []);

  return {
    // getChainId,
    // getRequestAccounts,
    // signing,
  };
}
