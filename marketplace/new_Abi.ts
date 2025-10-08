export const AppNFTCharityABI = [
    {
      inputs: [
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "uint256", name: "charityId", type: "uint256" },
        { internalType: "uint256", name: "status", type: "uint256" },
        { internalType: "uint256", name: "donations", type: "uint256" },
        { internalType: "uint256", name: "pay", type: "uint256" }
      ],
      name: "statusChange",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    }
  ];
  