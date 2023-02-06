import fastify, { FastifyInstance } from 'fastify';
import { Inject Injectable } from 'fastify-decorators';
import Web3 from 'web3';

@Injectable()
export class MetaMaskService {
  private web3: Web3;

  async connect(fastify: FastifyInstance): Promise<void> {
    this.web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

    // Check if the user has MetaMask installed and unlocked
    if (!this.web3.currentProvider.isMetaMask) {
      throw new Error('Please install and unlock MetaMask');
    }

    // Check if the user has connected to the correct network
    const network = await this.web3.eth.net.getNetworkType();
    if (network !== 'rinkeby') {
      throw new Error(`Please connect to the Rinkeby network in MetaMask. Current network: ${network}`);
    }
  }
}