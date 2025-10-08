async function main()
{
    const appNFT = await ethers.deployContract("AppNFT");
    const contractAddressNFTsvg = await appNFT.getAddress();
    console.log("Contract AppNFT deployed to address:", contractAddressNFTsvg);
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });