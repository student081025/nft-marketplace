const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = require("ethers");


const 
{
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe ("NFTCharity", function ()
{  
    async function deploy() 
    {
        const [owner, user] = await hre.ethers.getSigners();
        const NFTCharity = await hre.ethers.deployContract("CharitytoKoteyka");
        const AppNFT = await hre.ethers.deployContract("AppNFTCharity");
        await  NFTCharity.waitForDeployment();
        await  AppNFT.waitForDeployment();
        return {NFTCharity, AppNFT, owner, user};
    }

    it("Access denied (setContractConnect)", async function ()
    {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        await expect(NFTCharity.connect(user).setContractConnect(AppNFT.getAddress())).to.be.revertedWithCustomError(NFTCharity, "OwnableUnauthorizedAccount");
    });

    it("Access denied (updateJson)", async function ()
    {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTCharity.connect(owner).mint(1000000000);
        await NFTCharity.connect(owner).setContractConnect(AppNFT.getAddress());
        await expect(NFTCharity.connect(user).updateJson(0, 0, 0, 1000000000)).to.be.revertedWith("You do not have access to this function");
    });

    it("Should support ERC721 interface", async function ()
    {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        const ERC721InterfaceId = "0x80ac58cd";
        expect(await NFTCharity.supportsInterface(ERC721InterfaceId)).to.equal(true);
    });
    
    it("Minting NFT", async function ()
    {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTCharity.connect(owner).mint(1000000000);
        let time1 = await time.latest();
        let url = await NFTCharity.connect(owner).tokenURI(0)
        let res = await fetch(url);
        let html = await res.text();
        let obj = JSON.parse(html);
        expect(Number(obj.id)).to.equal(0);
        expect(Number(obj.status)).to.be.equal(0);
        expect(obj.rank).to.equal('Bronze');
        expect(Number(obj.sum)).to.be.equal(0);
        expect(Number(obj.pay)).to.be.equal(1000000000);
    });

    it("Should revert transfer of soulbound token", async function() 
    {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTCharity.connect(owner).mint(1000000000);
        await expect(NFTCharity.connect(owner).transferFrom(owner.address, user.address, 0)).to.be.revertedWith("Soulbound: Transfer failed");
    });

    it("Should change rank according to donations", async function() 
    {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTCharity.connect(owner).mint(1000000000);
        await NFTCharity.connect(owner).setContractConnect(owner.address);
        await NFTCharity.connect(owner).updateJson(0, 0, BigInt("1000000000000000000"), 1000000000);
        let url = await NFTCharity.connect(owner).tokenURI(0);
        let res = await fetch(url);
        let html = await res.text();
        let obj = JSON.parse(html);
        await expect(obj.rank).to.equal("Silver");
        await NFTCharity.connect(owner).updateJson(0, 0, BigInt("2000000000000000000"), 1000000000);
        let url1 = await NFTCharity.connect(owner).tokenURI(0);
        let res1 = await fetch(url1);
        let html1 = await res1.text();
        let obj1 = JSON.parse(html1);
        await expect(obj1.rank).to.equal("Gold");
    });

    it("Burn NFT", async function ()
    {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTCharity.connect(owner).mint(1000000000);
        await NFTCharity.connect(owner).mint(1000000000);
        await NFTCharity.connect(owner).mint(1000000000);
        let res = await NFTCharity.connect(owner).tokensOfOwner(owner.address);
        await NFTCharity.connect(owner).burnNFT(0);
        let res1 = await NFTCharity.connect(owner).tokensOfOwner(owner.address);
        expect(Number(res[1]) - 1).to.equal(Number(res1[1]));
    });
})

describe ("AppNFTCharity", function ()
{  
    async function deploy() 
    {
        const [owner, user] = await hre.ethers.getSigners();
        const NFTCharity = await hre.ethers.deployContract("CharitytoKoteyka");
        const AppNFT = await hre.ethers.deployContract("AppNFTCharity");
        await  NFTCharity.waitForDeployment();
        await  AppNFT.waitForDeployment();
        return {NFTCharity, AppNFT, owner, user};
    }

    it("Access denied (addNFTContract)", async function ()
    {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        await expect(AppNFT.connect(user).addNFTContract(1, NFTCharity.getAddress())).to.be.revertedWith("Only manager can call this function");
    });

    it("Access denied (deleteNFTContract)", async function ()
    {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        await expect(AppNFT.connect(user).deleteNFTContract(1)).to.be.revertedWith("Only manager can call this function");
    });

     it("The call of ownerOf(uint256) was not successful (transferFunds, statusChange)", async function ()
    {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTCharity.connect(owner).mint(100000000);
        let time1 = await time.latest();
        await AppNFT.connect(owner).addNFTContract(1, NFTCharity.getAddress());
        await NFTCharity.connect(owner).setContractConnect(AppNFT.getAddress());
        await expect(AppNFT.connect(owner).transferFunds(1, 1, time1, 0, 100000000, {value: 100000000})).to.be.revertedWith("The call of ownerOf(uint256) was not successful");
        await expect(AppNFT.connect(owner).statusChange(1, 1, time1, 0, 10000000)).to.be.revertedWith("The call of ownerOf(uint256) was not successful");
    });

    it("The call of tokenByIndex(uint256) was not successful (getTokenIdByOwner)", async function ()
    {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTCharity.connect(owner).mint(100000000);
        await NFTCharity.connect(owner).setContractConnect(AppNFT.getAddress());
        await AppNFT.connect(owner).addNFTContract(1, NFTCharity.getAddress());
        await expect(AppNFT.connect(owner).getTokenIdByOwner(1, 1)).to.be.revertedWith('The call of tokenByIndex(uint256) was not successful');
    });

    it("The call of tokenURI(uint256) was not successful (returnURI)", async function ()
    {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTCharity.connect(owner).mint(1000000);
        await NFTCharity.connect(owner).setContractConnect(AppNFT.getAddress());
        await AppNFT.connect(owner).addNFTContract(1, NFTCharity.getAddress());
        await expect(AppNFT.connect(owner).returnURI(1, 1)).to.be.revertedWith("The call of tokenURI(uint256) was not successful");
    });

    it("The call totalSupply(uint256) was not successful (getTotalSupply)", async function () {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTCharity.connect(owner).setContractConnect(AppNFT.getAddress());
        await AppNFT.connect(owner).addNFTContract(1, AppNFT.getAddress());
        await expect(AppNFT.connect(owner).getTotalSupply(1)).to.be.revertedWith("The call of totalSupply() was not successful" );
    });

    it("Adding NFT contract to communicate", async function ()
    {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        await AppNFT.connect(owner).addNFTContract(1, NFTCharity.getAddress());
        let res = await AppNFT.connect(owner).getNFTContract(1);
        let res1 = await NFTCharity.getAddress();
        expect(res).to.equal(res1);
    });

    it("Deleting NFT contract", async function ()
    {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        await AppNFT.connect(owner).addNFTContract(1, NFTCharity.getAddress());
        await AppNFT.connect(owner).deleteNFTContract(1);
        let res = await AppNFT.connect(owner).getNFTContract(1);
        expect(res).to.equal(ethers.ZeroAddress);
    });

    it("Returning NFT uri", async function ()
    {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        await AppNFT.connect(owner).addNFTContract(1, NFTCharity.getAddress());
        await NFTCharity.connect(owner).mint(10000000);
        let res = await NFTCharity.connect(owner).tokenURI(0);
        let res1 = await AppNFT.connect(owner).returnURI(0, 1);
        expect(res).to.equal(res1);
    });

    it("You do not have access to this NFT (transferFunds)", async function ()
    {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTCharity.connect(owner).mint(10000000);
        let time1 = await time.latest();
        await AppNFT.connect(owner).addNFTContract(1, NFTCharity.getAddress());
        await NFTCharity.connect(owner).setContractConnect(AppNFT.getAddress());
        await expect(AppNFT.connect(user).transferFunds(0, 1, time1, 0, 10000000, {value: 10000000 })).to.be.revertedWith("You do not have access to this NFT");
    });

    it("The subscription is paused (transferFunds)", async function ()
    {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTCharity.connect(owner).mint(10000000);
        await AppNFT.connect(owner).addNFTContract(1, NFTCharity.getAddress());
        await NFTCharity.connect(owner).setContractConnect(AppNFT.getAddress());
        await expect(AppNFT.connect(owner).transferFunds(0, 1, 0, 0, 10000000, {value: 10000000 })).to.be.revertedWith("The subscription is paused");
    });

    it("Deadline for payment has not come (transferFunds)", async function ()
    {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTCharity.connect(owner).mint(10000000);
        let time1 = await time.latest();
        await AppNFT.connect(owner).addNFTContract(1, NFTCharity.getAddress());
        await NFTCharity.connect(owner).setContractConnect(AppNFT.getAddress());
        await expect(AppNFT.connect(owner).transferFunds(0, 1, time1 + 86400, 0, 10000000, {value: 1000000000000 })).to.be.revertedWith("Too early");
    });

    it("Wrong amount of ether is send (transferFunds)", async function ()
    {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTCharity.connect(owner).mint(10000000);
        let time1 = await time.latest();
        await AppNFT.connect(owner).addNFTContract(1, NFTCharity.getAddress());
        await NFTCharity.connect(owner).setContractConnect(AppNFT.getAddress());
        await expect(AppNFT.connect(owner).transferFunds(0, 1, time1, 0, 10000000, {value: 1000000000000 })).to.be.revertedWith("The amount of money is not correct");
    });

    it("Insufficient funds (transferFunds)", async function ()
    {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTCharity.connect(owner).mint(BigInt("2000000000000000000"));
        let time1 = await time.latest();
        await AppNFT.connect(owner).addNFTContract(1, NFTCharity.getAddress());
        await NFTCharity.connect(owner).setContractConnect(AppNFT.getAddress());
        const tx = {
            to: user.address,
            value:  hre.ethers.parseEther("9997"),
        };
        await owner.sendTransaction(tx);
        await expect(AppNFT.connect(owner).transferFunds(0, 1, time1, 0, BigInt("2000000000000000000"), {value: BigInt("2000000000000000000")})).to.be.revertedWith("Insufficient funds, replenish your balance");
    });

    it("Making a payment to charity organization", async function ()
    {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTCharity.connect(owner).mint(10000000);
        await AppNFT.connect(owner).addNFTContract(1, NFTCharity.getAddress());
        await NFTCharity.connect(owner).setContractConnect(AppNFT.getAddress());
        let time1 = await time.latest();
        await AppNFT.connect(owner).transferFunds(0, 1, time1, 0, 10000000, {value: 10000000 });
        let time2 = await time.latest();
        let url = await AppNFT.connect(owner).returnURI(0, 1);
        let res = await fetch(url);
        let html = await res.text();
        let obj = JSON.parse(html);
        expect(Number(obj.id)).to.equal(0);
        expect(obj.rank).to.equal('Bronze');
        expect(Number(obj.status)).to.be.equal(time2 + 86400);
        expect(Number(obj.sum)).to.be.equal(10000000);
        expect(Number(obj.pay)).to.be.equal(10000000);
    });

    it("You do not have access to this NFT (statusChange)", async function ()
    {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTCharity.connect(owner).mint(10000000);
        let time1 = await time.latest();
        await AppNFT.connect(owner).addNFTContract(1, NFTCharity.getAddress());
        await NFTCharity.connect(owner).setContractConnect(AppNFT.getAddress());
        await expect(AppNFT.connect(user).statusChange(0, 1, time1, 0, 10000000)).to.be.revertedWith("You do not have access to this NFT");
    });

     it("Changing the status", async function ()
    {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTCharity.connect(owner).mint(10000000);
        await AppNFT.connect(owner).addNFTContract(1, NFTCharity.getAddress());
        await NFTCharity.connect(owner).setContractConnect(AppNFT.getAddress());
        await AppNFT.connect(owner).statusChange(0, 1, 0, 0, 10000000);
        let url = await AppNFT.connect(owner).returnURI(0, 1);
        let res = await fetch(url);
        let html = await res.text();
        let obj = JSON.parse(html);
        let time1 = await time.latest();
        expect(Number(obj.id)).to.equal(0);
        expect(obj.rank).to.equal('Bronze');
        expect(Number(obj.status)).to.be.equal(time1 + 86400);
        expect(Number(obj.sum)).to.be.equal(0);
        expect(Number(obj.pay)).to.be.equal(10000000);
        await AppNFT.connect(owner).statusChange(0, 1, Number(obj.status), 0, 10000000);
        let url1 = await AppNFT.connect(owner).returnURI(0, 1);
        let res1 = await fetch(url1);
        let html1 = await res1.text();
        let obj1 = JSON.parse(html1);
        expect(Number(obj1.id)).to.equal(0);
        expect(obj1.rank).to.equal('Bronze');
        expect(Number(obj1.status)).to.be.equal(0);
        expect(Number(obj1.sum)).to.be.equal(0);
        expect(Number(obj1.pay)).to.be.equal(10000000);
    });

     it("Checking cycle for automated notification script", async function ()
    {
        const {NFTCharity, AppNFT, owner, user} = await loadFixture(deploy);
        await NFTCharity.connect(owner).mint(10000000);
        await NFTCharity.connect(owner).mint(10000000);
        await NFTCharity.connect(owner).mint(10000000);
        await AppNFT.connect(owner).addNFTContract(1, NFTCharity.getAddress());
        await NFTCharity.connect(owner).setContractConnect(AppNFT.getAddress());

        const contracts = await AppNFT.connect(owner).getAllContracts();

        for (const contractId of contracts)
        {
            const totalSupply = await AppNFT.connect(owner).getTotalSupply(contractId)
            expect(totalSupply).to.be.equal(3);
            for (let i = 0; i < totalSupply; i++) 
            {
                const [tokenId, user] = await AppNFT.connect(owner).getTokenIdByOwner(i, contractId);
                expect(tokenId).to.be.equal(i);
                expect(user).to.be.equal(owner.address);
            }
        }
    });

})