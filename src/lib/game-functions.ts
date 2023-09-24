import { CONTRACT_ADDRESS } from "@/screens/waiting-room";
import { getInstance, getTokenSignature, provider } from "../lib/fhevm";
import { Contract } from "ethers";
import mafiaABI from "../abi/mafia.json";

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
    console.log(result);
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

export const takeAction = async () => {
  const playerId = 2;
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
    // setUserRole(userCreditScoreDecrypted);
    // setLoading("");
  } catch (e) {
    console.log(e);
    // setLoading("");
    // setDialog("Error during reencrypt!");
  }
};
