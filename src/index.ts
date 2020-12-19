import * as CryptoJS from 'crypto-js';

class Block {
  static claculateBlockHash = (previousHash: string, timestamp: number, data: string): string =>
    CryptoJS.SHA256(previousHash + timestamp + data).toString();

  static validateStructure = (aBlock: Block): boolean =>
    typeof aBlock.hash === 'string' &&
    typeof aBlock.data === 'string' &&
    typeof aBlock.previousHash === 'string' &&
    typeof aBlock.timestamp === 'number';

  public hash: string;
  public previousHash: string;
  public data: string;
  public timestamp: number;

  constructor(hash: string, previousHash: string, data: string, timestamp: number) {
    this.hash = hash;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}

const genesisBlock: Block = new Block('12314214', '', 'Hello', 12345);

//type이 Block이 아니면 배열에 담지 않음.
let blockChain: Block[] = [genesisBlock];

const getBlockchain = (): Block[] => blockChain;
const getLatestBlock = (): Block => blockChain[blockChain.length - 1];
const getNewTimestamp = (): number => Math.round(new Date().getTime() / 1000);
const createNewBlock = (data: string): Block => {
  const previousBlock: Block = getLatestBlock();
  const newTimestamp: number = getNewTimestamp();
  const newHash: string = Block.claculateBlockHash(previousBlock.hash, newTimestamp, data);
  const newBlock: Block = new Block(newHash, previousBlock.hash, data, newTimestamp);
  addBlock(newBlock);
  return newBlock;
};

//블록의 해쉬를 얻기
const getHashforBlock = (aBlock: Block): string =>
  Block.claculateBlockHash(aBlock.previousHash, aBlock.timestamp, aBlock.data);

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
  //첫번째 Block이 유효한지 체크함.
  if (!Block.validateStructure(candidateBlock)) {
    return false;
  } else if (previousBlock.hash !== candidateBlock.previousHash) {
    return false;
  } else if (getHashforBlock(candidateBlock) !== candidateBlock.hash) {
    return false;
  } else {
    return true;
  }
};

const addBlock = (candidateBlock: Block): void => {
  if (isBlockValid(candidateBlock, getLatestBlock())) {
    blockChain.push(candidateBlock);
  }
};

createNewBlock('secondBlock');
createNewBlock('thirdBlock');
createNewBlock('fourthBlock');

console.log(blockChain);

export {};
