import { CONTRACT_ADDRESS } from "@/screens/in-game";
import { getInstance, getTokenSignature, provider } from "../lib/fhevm";
import { Contract } from "ethers";
import mafiaABI from "../abi/mafia.json";
import { shuffleArray } from "./utils";

export const initializeGame = async () => {
  const instance = await getInstance();
  // const originalArray = [1, 2, 3, 4, 4];
  const originalArray = [1, 2, 3];
  const shuffledArray = [...originalArray];
  // Shuffle the copied array
  shuffleArray(shuffledArray);

  for (let i = 0; i < shuffledArray.length; i++) {
    shuffledArray[i] = instance.encrypt8(shuffledArray[i]);
  }

  // console.log(shuffledArray.length);/
  try {
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, mafiaABI, signer);
    // setLoading("Initializing game...");
    const transaction = await contract.initializeGame(shuffledArray);
    // setLoading("Waiting for transaction validation...");
    await provider.waitForTransaction(transaction.hash);

    return transaction;
    // setLoading("");
    // setDialog("Game Initialized!");
  } catch (e) {
    console.log(e);
    // setLoading("");
    // setDialog("Transaction error!");
  }
};
export const viewCaught = async () => {
  try {
    const instance = await getInstance();
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, mafiaABI, signer);
    // setLoading("Decrypting if selected target is Mafia...");
    const { publicKey, signature } = await getTokenSignature(CONTRACT_ADDRESS, signer.address);
    const ciphertext = await contract.viewCaught(publicKey, signature);
    console.log(ciphertext);
    const userCreditScoreDecrypted = instance.decrypt(CONTRACT_ADDRESS, ciphertext);
    console.log(ciphertext, userCreditScoreDecrypted);
    // setUserRole(userCreditScoreDecrypted);
    // setLoading("");
  } catch (e) {
    console.log(e);
    // setLoading("");
    // setDialog("Error during reencrypt!");
  }
};

export const queryUsers = async () => {
  try {
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, mafiaABI, signer);
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

export const joinGame = async () => {
  try {
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, mafiaABI, signer);
    // setLoading("Joining Game...");
    const result = await contract.joinGame();
    console.log(result);
    // setLoading("Success!");
  } catch (e) {
    console.log(e);
    // setLoading("");
    // setDialog("Error during joining!");
  }
};

export const takeAction = async (playerId: number) => {
  // const playerId = 2;
  try {
    const instance = await getInstance();
    const encryptedData = instance.encrypt8(playerId);
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, mafiaABI, signer);
    // setLoading("Taking Action on selected player...");
    const transaction = await contract.action(encryptedData);
    console.log(encryptedData);
    // setLoading("Waiting for transaction validation...");
    await provider.waitForTransaction(transaction.hash);
    // setLoading("");
    // setDialog("Action has been taken");
  } catch (e) {
    console.log(e);
    // setLoading("");
    // setDialog("Transaction error!");
  }
};

export const votePlayer = async () => {
  const playerId = 2;
  try {
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, mafiaABI, signer);
    // setLoading("Casting vote on selected player...");
    const transaction = await contract.castVote(playerId);
    // setLoading("Waiting for transaction validation...");
    await provider.waitForTransaction(transaction.hash);
    // setLoading("");
    // setDialog("Vote has been casted");
  } catch (e) {
    console.log(e);
    // setLoading("");
    // setDialog("Transaction error!");
  }
};

export const viewRole = async () => {
  try {
    const instance = await getInstance();

    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, mafiaABI, signer);
    // setLoading("Decrypting User Role...");
    const { publicKey, signature } = await getTokenSignature(CONTRACT_ADDRESS, signer.address);
    const ciphertext = await contract.viewOwnRole(publicKey, signature);
    console.log(ciphertext);
    const userCreditScoreDecrypted = instance.decrypt(CONTRACT_ADDRESS, ciphertext);
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

export const getGameStateFromContract = async () => {
  try {
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, mafiaABI, signer);
    const r = await contract.gameState();
    return Number(r);
  } catch (e) {
    console.log(e);
    console.log("Couldnt get game state from the contract.");
  }
};
