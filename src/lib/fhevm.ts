import { BrowserProvider } from "ethers";
import { initFhevm, createInstance } from "fhevmjs";
export const init = async () => {
  await initFhevm();
};

// export const provider = new BrowserProvider(window.ethereum);

let instance: any;

export const createFhevmInstance = async (p: BrowserProvider) => {
  // const network = await p.getNetwork();
  // const chainId = +network.chainId.toString();
  const publicKey = await p.call({
    from: null,
    to: "0x0000000000000000000000000000000000000044",
  });
  instance = await createInstance({ chainId: 9090, publicKey });
};

export const getInstance = async (p: BrowserProvider) => {
  await init();
  await createFhevmInstance(p);
  return instance;
};

export const getTokenSignature = async (contractAddress: any, userAddress: any) => {
  // const instance = await createInstance({ chainId, publicKey });
  const { publicKey, token } = instance.generateToken({
    verifyingContract: contractAddress,
  });
  const params = [userAddress, JSON.stringify(token)];
  const signature = await window.ethereum.request({
    method: "eth_signTypedData_v4",
    params,
  });
  instance.setTokenSignature(contractAddress, signature);
  return { signature, publicKey };
};
