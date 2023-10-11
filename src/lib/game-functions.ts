import { getInstance, getTokenSignature } from "../lib/fhevm";
import { BrowserProvider, Contract } from "ethers";
import mafiaABI from "../abi/mafia.json";
import factoryABI from "../abi/factory.json";
import { shuffleArray } from "./utils";
import { ConnectedWallet } from "@privy-io/react-auth";
import { FACTORY_ADDRESS } from "@/screens/authenticated";

export const initializeGame = async (w: ConnectedWallet, contractAddress: string) => {
  w.switchChain(9090);
  const a = await w.getEthereumProvider();
  const p = new BrowserProvider(a);
  const instance = await getInstance(p);
  const originalArray = [1, 2, 3, 4];
  const shuffledArray = [...originalArray];
  shuffleArray(shuffledArray);
  for (let i = 0; i < shuffledArray.length; i++) {
    shuffledArray[i] = instance.encrypt8(shuffledArray[i]);
  }

  try {
    const signer = await p.getSigner();
    const contract = new Contract(contractAddress, mafiaABI, signer);
    const transaction = await contract.initializeGame(shuffledArray);
    await p.waitForTransaction(transaction.hash);
    return transaction;
  } catch (e) {
    console.log(e);
  }
};

export const viewCaught = async (w: ConnectedWallet, contractAddress: string) => {
  try {
    w.switchChain(9090);
    const a = await w.getEthereumProvider();
    const p = new BrowserProvider(a);
    const instance = await getInstance(p);
    const signer = await p.getSigner();
    const contract = new Contract(contractAddress, mafiaABI, signer);
    const { publicKey, signature } = await getTokenSignature(contractAddress, signer.address, a);
    const ciphertext = await contract.viewCaught(publicKey, signature);
    const userCreditScoreDecrypted = instance.decrypt(contractAddress, ciphertext);
    console.log(ciphertext, userCreditScoreDecrypted);
  } catch (e) {
    console.log(e);
  }
};

export const queryUsers = async (w: ConnectedWallet, contractAddress: string) => {
  try {
    w.switchChain(9090);
    const a = await w.getEthereumProvider();
    const p = new BrowserProvider(a);
    const signer = await p.getSigner();
    const contract = new Contract(contractAddress, mafiaABI, signer);
    // setLoading("Joining Game...");
    const result = await contract.getPlayersArray();
    return result;
    // setLoading("Success!");
  } catch (e) {
    console.log(e);
    // setLoading("");
    // setDialog("Error querying users!");
  }
};

export const joinGame = async (w: ConnectedWallet, contractAddress: string) => {
  try {
    w.switchChain(9090);
    const a = await w.getEthereumProvider();
    const p = new BrowserProvider(a);
    const signer = await p.getSigner();
    const contract = new Contract(contractAddress, mafiaABI, signer);
    // setLoading("Joining Game...");
    const result = await contract.joinGame();
    return result;
    // setLoading("Success!");
  } catch (e) {
    console.log(e);
    // setLoading("");
    // setDialog("Error during joining!");
  }
};

export const takeAction = async (playerId: number, w: ConnectedWallet, contractAddress: string) => {
  // const playerId = 2;
  try {
    w.switchChain(9090);
    const a = await w.getEthereumProvider();
    const p = new BrowserProvider(a);
    const instance = await getInstance(p);
    const encryptedData = instance.encrypt8(playerId);

    const signer = await p.getSigner();
    const contract = new Contract(contractAddress, mafiaABI, signer);
    // setLoading("Taking Action on selected player...");
    const transaction = await contract.action(encryptedData);
    console.log(encryptedData);
    // setLoading("Waiting for transaction validation...");
    await p.waitForTransaction(transaction.hash);
    // setLoading("");
    // setDialog("Action has been taken");
  } catch (e) {
    console.log(e);
    // setLoading("");
    // setDialog("Transaction error!");
  }
};

export const votePlayer = async (playerId: number, w: ConnectedWallet, contractAddress: string) => {
  try {
    w.switchChain(9090);
    const a = await w.getEthereumProvider();
    const p = new BrowserProvider(a);
    const signer = await p.getSigner();
    const contract = new Contract(contractAddress, mafiaABI, signer);
    // setLoading("Casting vote on selected player...");
    const transaction = await contract.castVote(playerId);
    // setLoading("Waiting for transaction validation...");
    await p.waitForTransaction(transaction.hash);
    // setLoading("");
    // setDialog("Vote has been casted");
  } catch (e) {
    console.log(e);
    // setLoading("");
    // setDialog("Transaction error!");
  }
};

export const viewRole = async (wallet: ConnectedWallet, contractAddress: string) => {
  try {
    wallet.switchChain(9090);
    const a = await wallet.getEthereumProvider();
    const provider = new BrowserProvider(a);
    const instance = await getInstance(provider);

    const signer = await provider.getSigner();
    const contract = new Contract(contractAddress, mafiaABI, signer);
    // setLoading("Decrypting User Role...");
    const { publicKey, signature } = await getTokenSignature(contractAddress, signer.address, a);
    const ciphertext = await contract.viewOwnRole(publicKey, signature);
    console.log(ciphertext);
    const userCreditScoreDecrypted = instance.decrypt(contractAddress, ciphertext);
    console.log(ciphertext, userCreditScoreDecrypted);
    return userCreditScoreDecrypted;
    // setUserRole(userCreditScoreDecrypted);
    // setLoading("");
  } catch (e) {
    console.log(e);
    // setLoading("");
    // setDialog("Error during reencrypt!");
  }
};

export const getGameStateFromContract = async (w: ConnectedWallet, contractAddress: string) => {
  try {
    // w.switchChain(9090);
    w.switchChain(9090);
    const a = await w.getEthereumProvider();
    const p = new BrowserProvider(a);
    console.log(await p.getNetwork());
    const signer = await p.getSigner();
    const contract = new Contract(contractAddress, mafiaABI, signer);
    const r = await contract.gameState();
    return Number(r);
  } catch (e) {
    console.log(e);
    console.log("Couldnt get game state from the contract.");
  }
};

export const getDeadPlayer = async (w: ConnectedWallet, contractAddress: string) => {
  try {
    w.switchChain(9090);
    const a = await w.getEthereumProvider();
    const p = new BrowserProvider(a);
    const signer = await p.getSigner();
    const contract = new Contract(contractAddress, mafiaABI, signer);
    const r = await contract.playerKilled();
    return Number(r);
  } catch (e) {
    console.log(e);
    console.log("Couldnt get game state from the contract.");
  }
};

export const isMafiaKilled = async (w: ConnectedWallet, contractAddress: string) => {
  try {
    w.switchChain(9090);
    const a = await w.getEthereumProvider();
    const p = new BrowserProvider(a);
    const signer = await p.getSigner();
    const contract = new Contract(contractAddress, mafiaABI, signer);
    const r = await contract.isMafiaKilled();
    return Number(r);
  } catch (e) {
    console.log(e);
    console.log("Couldnt get game state from the contract.");
  }
};

export const createGame = async (w: ConnectedWallet) => {
  try {
    w.switchChain(9090);
    const a = await w.getEthereumProvider();
    console.log(a);
    const p = new BrowserProvider(a);
    console.log(p);

    const signer = await p.getSigner();
    console.log(signer);

    const contract = new Contract(FACTORY_ADDRESS, factoryABI, signer);
    console.log(contract);

    const response = await contract.createGame();
    const receipt = await p.getTransactionReceipt(response.hash);
    const data = receipt.logs[0].data.replace("0x", "");
    const address = "0x" + data.substring(24, 64);
    console.log(address);
    return address;
    // return response.data;
    // console.log(gameId);
    // const address = await contract.getRoomAddress(gameId);
    // return address;
  } catch (e) {
    console.log(e);
    console.log("Couldnt create game.");
  }
};
