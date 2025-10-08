async function main()
{
    const NFTFitness = await ethers.deployContract("GymMembershipToSportick");
    const contractAddressNFTFitness = await NFTFitness.getAddress();
    console.log("Contract NFTFitness deployed to address:", contractAddressNFTFitness);
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });