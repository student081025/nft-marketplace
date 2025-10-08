const { ethers } = require('ethers');

const ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"ID","type":"uint256"},{"internalType":"address","name":"NFTContract","type":"address"}],"name":"addNFTContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"ID","type":"uint256"}],"name":"deleteNFTContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllContracts","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"ID","type":"uint256"}],"name":"getNFTContract","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"num","type":"uint256"},{"internalType":"uint256","name":"charityId","type":"uint256"}],"name":"getTokenIdByOwner","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"charityId","type":"uint256"}],"name":"getTotalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"charityId","type":"uint256"}],"name":"returnURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"charityId","type":"uint256"},{"internalType":"uint256","name":"status","type":"uint256"},{"internalType":"uint256","name":"donations","type":"uint256"},{"internalType":"uint256","name":"pay","type":"uint256"}],"name":"statusChange","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"charityId","type":"uint256"},{"internalType":"uint256","name":"status","type":"uint256"},{"internalType":"uint256","name":"donations","type":"uint256"},{"internalType":"uint256","name":"pay","type":"uint256"}],"name":"transferFunds","outputs":[],"stateMutability":"payable","type":"function"}];
const CONTRACT_ADDRESS = '0xB23b3F8029a808b56a7b25EF16E50D37A35Da6DB';

exports.handler = async function (credentials) {
  const provider = new ethers.providers.JsonRpcProvider('YourInfuraURL');
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

  const now = Math.floor(Date.now() / 1000);
  const contracts = await contract.getAllContracts();

  for (const contractId of contracts) {
    console.log(`Processing contract ID: ${contractId}`);

    const totalSupply = await contract.getTotalSupply(contractId);
    console.log(`Found ${totalSupply} tokens for contract ${contractId}`);

    for (let i = 0; i < totalSupply; i++) {
      try {
        const [tokenId, user] = await contract.getTokenIdByOwner(i, contractId);
        const uri = await contract.returnURI(tokenId, contractId);
        const base64 = uri.split(',')[1];
        const jsonString = Buffer.from(base64, 'base64').toString();
        const obj = JSON.parse(jsonString);

        const status = Number(obj.status);
        if (status <= now && status !== 0) {
          console.log(`Notification for ${tokenId} of ${user}`);
          await triggerNotification(tokenId.toString(), user, contractId.toString(), obj.status, obj.donations, obj.pay);
        }
      } catch (err) {
        console.error(`Error processing token ${i}:`, err.message);
      }
    }
  }

  console.log('All processing complete');
};

async function triggerNotification(tokenId, user, contractId, status, donations, pay, token) {
  try {
    const response = await fetch('https://app-1-kappa.vercel.app/api/webhook', {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: "payment-due",
        payload: {
          client: user,
          pay: pay,
          token_id: tokenId,
          contract_id: contractId,
          status: status,
          donations: donations
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Notification failed:", error.message);
    throw error;
  }
}
