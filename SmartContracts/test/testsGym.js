const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = require("ethers");


const 
{
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe ("NFTFitness", function ()
{  
    async function deploy() 
    {
        const [owner, user] = await hre.ethers.getSigners();
        const NFTFitness = await hre.ethers.deployContract("GymMembershipToSportick");
        const AppNFT = await hre.ethers.deployContract("AppNFT");
        await  NFTFitness.waitForDeployment();
        await  AppNFT.waitForDeployment();
        return {NFTFitness, AppNFT, owner, user};
    }

    it("Access denied (mint)", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await expect(NFTFitness.connect(user).mint('tariff', 5, 2)).to.be.revertedWithCustomError(NFTFitness, "OwnableUnauthorizedAccount");
    });

    it("Access denied (setContractConnect)", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await expect(NFTFitness.connect(user).setContractConnect(AppNFT.getAddress())).to.be.revertedWithCustomError(NFTFitness, "OwnableUnauthorizedAccount");
    });

    it("Access denied (changeMintTime)", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTFitness.connect(owner).mint('tariff', 5, 2);
        await NFTFitness.connect(owner).setContractConnect(AppNFT.getAddress());
        await expect(NFTFitness.connect(user).changeMintTime(0, 28342984029)).to.be.revertedWith("You do not have access to this function");
    });

    it("Access denied (updateJson)", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTFitness.connect(owner).mint('tariff', 5, 2);
        await NFTFitness.connect(owner).setContractConnect(AppNFT.getAddress());
        await expect(NFTFitness.connect(user).updateJson(0, 1, 'tariff', 5, 3)).to.be.revertedWith("You do not have access to this function");
    });

    it("Should support ERC721 interface", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        const ERC721InterfaceId = "0x80ac58cd";
        expect(await NFTFitness.supportsInterface(ERC721InterfaceId)).to.equal(true);
    });
    
    it("Minting NFT", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTFitness.connect(owner).mint('tariff', 5, 2);
        let time1 = await time.latest();
        let url = await NFTFitness.connect(owner).tokenURI(0)
        let res = await fetch(url);
        let html = await res.text();
        let obj = JSON.parse(html);
        expect(Number(obj.id)).to.equal(0);
        expect(obj.tariff).to.equal('tariff');
        expect(Number(obj.date)).to.be.equal(5);
        expect(Number(obj.visits)).to.be.equal(2);
        expect(Number(obj.status)).to.be.equal(time1);
    });

    it("Storing NFT minting time", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTFitness.connect(owner).mint('tariff', 5, 2);
        let time1 = await time.latest();
        let time2 = await NFTFitness.connect(owner).getTimeOfMint(0);
        expect(time2).to.be.equal(time1);
    });

    it("Transfer NFT to user", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTFitness.connect(owner).mint('tariff', 5, 2);
        await NFTFitness.connect(owner).mint('tariff1', 10, 4);
        await NFTFitness.connect(owner).mint('tariff2', 8, 3);
        await NFTFitness.connect(owner).transferFrom(owner.address, user.address, 0);
        await NFTFitness.connect(owner).transferFrom(owner.address, user.address, 1);
        let res = await NFTFitness.connect(owner).tokensOfOwner(owner.address);
        let res1 = await NFTFitness.connect(owner).tokensOfOwner(user.address);
        expect(Number(res[1])).to.equal(1);
        expect(Number(res1[1])).to.equal(2);
    });

    it("Burn NFT", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTFitness.connect(owner).mint('tariff', 5, 2);
        await NFTFitness.connect(owner).mint('tariff1', 10, 4);
        await NFTFitness.connect(owner).mint('tariff2', 8, 3);
        let res = await NFTFitness.connect(owner).tokensOfOwner(owner.address);
        await NFTFitness.connect(owner).burnNFT(0);
        let res1 = await NFTFitness.connect(owner).tokensOfOwner(owner.address);
        expect(Number(res[1]) - 1).to.equal(Number(res1[1]));
    });
})

describe ("AppNFT", function ()
{  
    async function deploy() 
    {
        const [owner, user] = await hre.ethers.getSigners();
        const NFTFitness = await hre.ethers.deployContract("GymMembershipToSportick");
        const AppNFT = await hre.ethers.deployContract("AppNFT");
        await  NFTFitness.waitForDeployment();
        await  AppNFT.waitForDeployment();
        return {NFTFitness, AppNFT, owner, user};
    }

    it("Access denied (addNFTContract)", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await expect(AppNFT.connect(user).addNFTContract(1, NFTFitness.getAddress())).to.be.revertedWith("Only manager can call this function");
    });

    it("Access denied (deleteNFTContract)", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await expect(AppNFT.connect(user).deleteNFTContract(1)).to.be.revertedWith("Only manager can call this function");
    });

    it("The call of tokensOfOwner(address) was not successful (hasNFTToGym)", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTFitness.connect(owner).mint('tariff', 5, 2);
        await NFTFitness.connect(owner).mint('tariff1', 10, 4);
        await NFTFitness.connect(owner).mint('tariff2', 8, 3);
        await AppNFT.connect(owner).addNFTContract(1, NFTFitness.getAddress());
        await expect(AppNFT.connect(owner).hasNFTToGym(1, ethers.ZeroAddress)).to.be.revertedWith("The call of tokensOfOwner(address) was not successful");
    });

    it("The call of getTimeOfMint(uint256) was not successful (getDuration)", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTFitness.connect(owner).mint('tariff', 5, 2);
        let time1 = await time.latest();
        await NFTFitness.connect(owner).setContractConnect(AppNFT.getAddress());
        await AppNFT.connect(owner).addNFTContract(1, NFTFitness.getAddress());
        await AppNFT.connect(owner).addNFTContract(2, AppNFT.getAddress());
        await expect(AppNFT.connect(owner).getDuration(2, 1, 5)).to.be.revertedWith("The call of getTimeOfMint(uint256) was not successful");
    });

    it("The call of ownerOf(uint256) was not successful (pauseMembership, unpauseMembership, writeOffVisit)", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTFitness.connect(owner).mint('tariff', 5, 2);
        let time1 = await time.latest();
        await AppNFT.connect(owner).addNFTContract(1, NFTFitness.getAddress());
        await NFTFitness.connect(owner).setContractConnect(AppNFT.getAddress());
        await expect(AppNFT.connect(owner).writeOffVisit(1, 1, 1, 'tariff', 5, 6)).to.be.revertedWith("The call of ownerOf(uint256) was not successful");
        await expect(AppNFT.connect(owner).pauseMembership(1, 1, 1, 'tariff', 5, 6)).to.be.revertedWith("The call of ownerOf(uint256) was not successful");
        await expect(AppNFT.connect(owner).unpauseMembership(1, 1, time1, 'tariff', 5, 6)).to.be.revertedWith("The call of ownerOf(uint256) was not successful");
    });

     it("The call of tokenURI(uint256) was not successful (returnURI)", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTFitness.connect(owner).mint('tariff', 5, 2);
        await NFTFitness.connect(owner).setContractConnect(AppNFT.getAddress());
        await AppNFT.connect(owner).addNFTContract(1, NFTFitness.getAddress());
        await expect(AppNFT.connect(owner).returnURI(1, 1)).to.be.revertedWith("The call of tokenURI(uint256) was not successful");
    });

    it("Adding NFT contract to communicate", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await AppNFT.connect(owner).addNFTContract(1, NFTFitness.getAddress());
        let res = await AppNFT.connect(owner).getNFTContract(1);
        let res1 = await NFTFitness.getAddress();
        expect(res).to.equal(res1);
    });

    it("Deleting NFT contract", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await AppNFT.connect(owner).addNFTContract(1, NFTFitness.getAddress());
        await AppNFT.connect(owner).deleteNFTContract(1);
        let res = await AppNFT.connect(owner).getNFTContract(1);
        expect(res).to.equal(ethers.ZeroAddress);
    });

    it("Returning NFT uri", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await AppNFT.connect(owner).addNFTContract(1, NFTFitness.getAddress());
        await NFTFitness.connect(owner).mint('tariff', 5, 2);
        let res = await NFTFitness.connect(owner).tokenURI(0);
        let res1 = await AppNFT.connect(owner).returnURI(0, 1);
        expect(res).to.equal(res1);
    });

    it("Return all NFTs of the user from one particular gym", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTFitness.connect(owner).mint('tariff', 5, 2);
        await NFTFitness.connect(owner).mint('tariff1', 10, 4);
        await NFTFitness.connect(owner).mint('tariff2', 8, 3);
        await AppNFT.connect(owner).addNFTContract(1, NFTFitness.getAddress());
        let res = await AppNFT.connect(owner).hasNFTToGym(1, owner.address);
        let res1 = await NFTFitness.connect(owner).tokensOfOwner(owner.address);
        expect(res[0].toString()).to.equal(res1[0].toString());
    });

    it("You do not have access to this NFT (unpauseMembership)", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTFitness.connect(owner).mint('tariff', 5, 2);
        await AppNFT.connect(owner).addNFTContract(1, NFTFitness.getAddress());
        let url = await AppNFT.connect(owner).returnURI(0, 1);
        let res = await fetch(url);
        let html = await res.text();
        let obj = JSON.parse(html);
        await expect(AppNFT.connect(user).unpauseMembership(0, 1, Number(obj.status), obj.tariff, Number(obj.date), Number(obj.visits))).to.be.revertedWith("You do not have access to this NFT");
    });

    it("The membership is not paused (unpauseMembership)", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTFitness.connect(owner).mint('tariff', 5, 2);
        await AppNFT.connect(owner).addNFTContract(1, NFTFitness.getAddress());
        let url = await AppNFT.connect(owner).returnURI(0, 1);
        let res = await fetch(url);
        let html = await res.text();
        let obj = JSON.parse(html);
        await expect(AppNFT.connect(owner).unpauseMembership(0, 1, 1, obj.tariff, Number(obj.date), Number(obj.visits))).to.be.revertedWith("The membership is not paused");
    });

     it("Unpause the membership", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTFitness.connect(owner).mint('tariff', 5, 2);
        await AppNFT.connect(owner).addNFTContract(1, NFTFitness.getAddress());
        await NFTFitness.connect(owner).setContractConnect(AppNFT.getAddress());
        let url1 = await AppNFT.connect(owner).returnURI(0, 1);
        let res1 = await fetch(url1);
        let html1 = await res1.text();
        let obj1 = JSON.parse(html1);
        let time1 = await NFTFitness.connect(owner).getTimeOfMint(0);
        await AppNFT.connect(owner).unpauseMembership(0, 1, Number(obj1.status), obj1.tariff, Number(obj1.date), Number(obj1.visits));
        let url = await AppNFT.connect(owner).returnURI(0, 1);
        let res = await fetch(url);
        let html = await res.text();
        let obj = JSON.parse(html);
        let time2 = await NFTFitness.connect(owner).getTimeOfMint(0);
        expect(Number(obj.id)).to.equal(0);
        expect(obj.tariff).to.equal('tariff');
        expect(Number(obj.date)).to.be.equal(5);
        expect(Number(obj.visits)).to.be.equal(2);
        expect(Number(obj.status)).to.be.equal(1);
        expect(time1).to.be.not.equal(time2);
    });

    it("You do not have access to this NFT (pauseMembership)", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTFitness.connect(owner).mint('tariff', 5, 2);
        await AppNFT.connect(owner).addNFTContract(1, NFTFitness.getAddress());
        let url = await AppNFT.connect(owner).returnURI(0, 1);
        let res = await fetch(url);
        let html = await res.text();
        let obj = JSON.parse(html);
        await expect(AppNFT.connect(user).pauseMembership(0, 1, 1, obj.tariff, Number(obj.date), Number(obj.visits))).to.be.revertedWith("You do not have access to this NFT");
    });

    it("The membership is already paused (pauseMembership)", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTFitness.connect(owner).mint('tariff', 5, 2);
        await AppNFT.connect(owner).addNFTContract(1, NFTFitness.getAddress());
        let url = await AppNFT.connect(owner).returnURI(0, 1);
        let res = await fetch(url);
        let html = await res.text();
        let obj = JSON.parse(html);
        await expect(AppNFT.connect(owner).pauseMembership(0, 1, Number(obj.status), obj.tariff, Number(obj.date), Number(obj.visits))).to.be.revertedWith("The membership is already paused");
    });

    it("Pause the membership", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTFitness.connect(owner).mint('tariff', 5, 2);
        await AppNFT.connect(owner).addNFTContract(1, NFTFitness.getAddress());
        await NFTFitness.connect(owner).setContractConnect(AppNFT.getAddress());
        let url1 = await AppNFT.connect(owner).returnURI(0, 1);
        let res1 = await fetch(url1);
        let html1 = await res1.text();
        let obj1 = JSON.parse(html1);
        await AppNFT.connect(owner).pauseMembership(0, 1, 1, obj1.tariff, Number(obj1.date), Number(obj1.visits));
        let time1 = await time.latest();
        let url = await AppNFT.connect(owner).returnURI(0, 1);
        let res = await fetch(url);
        let html = await res.text();
        let obj = JSON.parse(html);
        expect(Number(obj.id)).to.equal(0);
        expect(obj.tariff).to.equal('tariff');
        expect(Number(obj.date)).to.be.equal(5);
        expect(Number(obj.visits)).to.be.equal(2);
        expect(Number(obj.status)).to.be.equal(time1);
    });

    it("You do not have access to this NFT (writeOffVisit)", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTFitness.connect(owner).mint('tariff', 5, 2);
        await AppNFT.connect(owner).addNFTContract(1, NFTFitness.getAddress());
        let url = await NFTFitness.connect(owner).tokenURI(0)
        let res = await fetch(url);
        let html = await res.text();
        let obj = JSON.parse(html);
        await expect(AppNFT.connect(user).writeOffVisit(0, 1, 1, obj.tariff, Number(obj.date), Number(obj.visits))).to.be.revertedWith("You do not have access to this NFT");
    });

    it("The membership is paused (writeOffVisit)", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTFitness.connect(owner).mint('tariff', 5, 2);
        await AppNFT.connect(owner).addNFTContract(1, NFTFitness.getAddress());
        let url = await NFTFitness.connect(owner).tokenURI(0)
        let res = await fetch(url);
        let html = await res.text();
        let obj = JSON.parse(html);
        await expect(AppNFT.connect(owner).writeOffVisit(0, 1, Number(obj.status), obj.tariff, Number(obj.date), Number(obj.visits))).to.be.revertedWith("The membership is paused");
    });

    it("No remaining visits (writeOffVisit)", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTFitness.connect(owner).mint('tariff', 5, 2);
        await AppNFT.connect(owner).addNFTContract(1, NFTFitness.getAddress());
        let url = await NFTFitness.connect(owner).tokenURI(0)
        let res = await fetch(url);
        let html = await res.text();
        let obj = JSON.parse(html);
        await expect(AppNFT.connect(owner).writeOffVisit(0, 1, 1, obj.tariff, Number(obj.date), 0)).to.be.revertedWith("No remaining visits");
    });

    it("Your gym membership expired (writeOffVisit)", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTFitness.connect(owner).mint('tariff', 2, 2);
        await AppNFT.connect(owner).addNFTContract(1, NFTFitness.getAddress());
        let url = await NFTFitness.connect(owner).tokenURI(0)
        let res = await fetch(url);
        let html = await res.text();
        let obj = JSON.parse(html);
        let time = await NFTFitness.connect(owner).getTimeOfMint(0);
        await NFTFitness.connect(owner).setContractConnect(owner.address);
        await NFTFitness.connect(owner).changeMintTime(0, Number(time) - 3 * 86400);
        await NFTFitness.connect(owner).setContractConnect(AppNFT.getAddress());
        await expect(AppNFT.connect(owner).writeOffVisit(0, 1, 1, obj.tariff, Number(obj.date), Number(obj.visits))).to.be.revertedWith("Your gym membership expired");
    });

    it("Write off visit", async function ()
    {
        const {NFTFitness, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTFitness.connect(owner).mint('tariff', 5, 2);
        await AppNFT.connect(owner).addNFTContract(1, NFTFitness.getAddress());
        await NFTFitness.connect(owner).setContractConnect(AppNFT.getAddress());
        let url = await AppNFT.connect(owner).returnURI(0, 1);
        let res = await fetch(url);
        let html = await res.text();
        let obj = JSON.parse(html);
        await AppNFT.connect(owner).unpauseMembership(0, 1, Number(obj.status), obj.tariff, Number(obj.date), Number(obj.visits));
        await AppNFT.connect(owner).writeOffVisit(0, 1, 1, obj.tariff, Number(obj.date), Number(obj.visits));
        let url1 = await AppNFT.connect(owner).returnURI(0, 1)
        let res1 = await fetch(url1);
        let html1 = await res1.text();
        let obj1 = JSON.parse(html1);
        expect(Number(obj1.id)).to.equal(0);
        expect(obj1.tariff).to.equal('tariff');
        expect(Number(obj1.date)).to.be.equal(5);
        expect(Number(obj1.visits)).to.be.equal(1);
        expect(Number(obj1.status)).to.be.equal(1);
    });
})