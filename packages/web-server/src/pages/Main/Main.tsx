/*------------------------------------------------------------------------------------------------------------------------------------------
 * Main.tsx
 * WRITER : 최정근
 * DATE : 2022-09-01
 * DISCRIPTION : 
 * TYPE : Page
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import React from 'react';
import axios from 'axios';
//import Web3 from 'web3';

import { DivisionBox } from 'lib/AmzPack';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from 'hook/useWeb3';

interface MainProps {}
function Main(props: MainProps) {
  /* ――――――――――――――― Variable ――――――――――――――― */
  /* ===== Props ===== */
  const {} = props;
  const web3 = useWeb3();

  /* ===== State ===== */

  /* ===== Const ===== */

  /* ====== API ====== */

  /* ―――――――――――――――― Method ―――――――――――――――― */
  function connectMetamask() {
    //web3.signing('Hahaha');
  }

  /* ―――――――――――――― Use Effect ―――――――――――――― */

  /* ―――――――――――――――― Return ―――――――――――――――― */
  return (
    <DivisionBox data-page="main" template="80px 80px auto" direction="VERTICAL" horizonAlign="center">
      <button onClick={() => connectMetamask()}>Connect Your Wallet</button>
    </DivisionBox>
  );
}

namespace Main {}

export default Main;
