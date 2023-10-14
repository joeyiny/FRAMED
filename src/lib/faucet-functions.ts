export const fetchFundsForNewUser = async (ethereumProvider, playerAddress) => {
  const response = await fetch('https://faucet.inco.network/api/get-faucet', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      address: playerAddress
    })
  });

  // Check if response is successful
  if (!response.ok) {
    const responseBody = await response.json();
    throw new Error(responseBody.message || 'Failed to fetch funds.');
  } else {
      console.log("Provided funds to ", playerAddress);
  }

  // Now fetch the updated balance
  const updatedBalance = await ethereumProvider.getBalance(playerAddress);
  return updatedBalance;
}
  