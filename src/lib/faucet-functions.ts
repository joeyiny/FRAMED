export const fetchFundsForNewUser = async (ethereumProvider, playerAddress) => {
  const response = await fetch("https://faucetdev.testnet.inco.org/api/get-faucet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address: playerAddress,
    }),
  });

  // Check if response is successful
  if (!response.ok) {
    const responseBody = await response.json();
    return { status: "error", message: responseBody.message || "Failed to fetch funds." };
  }

  console.log("Provided funds to ", playerAddress);
  localStorage.setItem("hasFunds", "true");
  return { status: "success" };
};
