import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useToast,
  Badge,
  Tooltip,
  IconButton
} from "@chakra-ui/react";
import {
  MediaRenderer,
  ThirdwebNftMedia,
  Web3Button,
  useContract,
  useAddress,
  useValidDirectListings,
  useValidEnglishAuctions,
  useContractWrite
} from "@thirdweb-dev/react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { SmartContract, NFT, ThirdwebSDK } from "@thirdweb-dev/sdk";
import React, { useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from 'next/router';
import { ethers } from "ethers";


type Props = {
  nft: NFT;
  contractMetadata: any;
};

export const MARKETPLACE_ADDRESS = "0xe73486152961244Dbe5a96b032A999c37694F1b6";

export const CHARITY_NFT_COLLECTION_ADDRESS = "0xAB46Fc85ac2d2cDB349Ee26e8fc784af822AC5ED"

export const APP_CHARITY_CONTRACT_ADDRESS = "0xB23b3F8029a808b56a7b25EF16E50D37A35Da6DB"

const TokenPage = ({ nft, contractMetadata }: Props) => {
  const { contract: marketplace, isLoading: loadingMarketplace } =
    useContract(MARKETPLACE_ADDRESS, "marketplace-v3");

  const { contract: nftCollection } = useContract(CHARITY_NFT_COLLECTION_ADDRESS);
  const { contract: appNFTCharity } = useContract(APP_CHARITY_CONTRACT_ADDRESS);
  const [isDonating, setIsDonating] = useState(false);
  const { mutateAsync: makeDonation } = useContractWrite(appNFTCharity, "transferFunds");
  const router = useRouter();
  const address = useAddress();
  const payAmount = ethers.utils.parseEther("0.1");

  const { data: directListing, isLoading: loadingDirectListing } =
    useValidDirectListings(marketplace, {
      tokenContract: CHARITY_NFT_COLLECTION_ADDRESS,
      tokenId: nft.metadata.id,
    });

  const [bidValue, setBidValue] = useState<string>("");
  const toast = useToast();

  const formatDonationAmount = (value: string | number | undefined) => {
    if (!value) return "0";
    try {
      const stringValue = typeof value === 'number' ? value.toString() : value;
      return parseFloat(ethers.utils.formatEther(stringValue)).toFixed(4);
    } catch {
      return "0";
    }
  };

  const handleDonate = async () => {
    if (!nft.metadata?.pay || nft.metadata.pay === "0") {
      toast({
        title: "Invalid Donation Amount",
        description: "This NFT doesn't have a valid donation amount set",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsDonating(true);
    try {
      const donationAmount = ethers.BigNumber.from(nft.metadata.pay);
      const tokenId = ethers.BigNumber.from(nft.metadata.id);
      const charityId = 1;
      const currentStatus = ethers.BigNumber.from(nft.metadata.status || "0");
      const currentDonations = ethers.BigNumber.from(nft.metadata.sum || "0");

      if (!appNFTCharity) {
        throw new Error("Charity contract not connected");
      }

      const tx = await makeDonation({
        args: [
          tokenId,
          charityId,
          currentStatus,
          currentDonations,
          donationAmount
        ],
        overrides: {
          value: donationAmount,
          gasLimit: 300000
        }
      });

      await tx.receipt;

      toast({
        title: "Donation Successful!",
        description: `Thank you for donating ${ethers.utils.formatEther(donationAmount)} ETH`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      router.replace(router.asPath);

    } catch (error: any) {
      console.error("Donation failed:", error);
      let errorMessage = "Transaction failed";
      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.data?.message) {
        errorMessage = error.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Donation Failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDonating(false);
    }
  };

  const { data: auctionListing, isLoading: loadingAuction } =
    useValidEnglishAuctions(marketplace, {
      tokenContract: CHARITY_NFT_COLLECTION_ADDRESS,
      tokenId: nft.metadata.id,
    });

  const currentStatus = nft.metadata?.status;
  const donations = nft.metadata?.sum || "0";
  const isPaused = currentStatus === "0";
  const statusText = isPaused ? "Paused" : "Active";
  const statusColor = isPaused ? "red" : "green";

  async function togglePauseStatus() {
    if (!appNFTCharity || !nftCollection) return;

    try {
      const tokenId = nft.metadata.id;
      const charityId = 1;
      const status = currentStatus;
      const donations = nft.metadata?.sum || "0";
      const pay = nft.metadata?.pay || "0";

      await appNFTCharity.call("statusChange", [
        tokenId,
        charityId,
        status,
        donations,
        pay
      ]);

      toast({
        title: "Status updated",
        description: `NFT is now ${isPaused ? "active" : "paused"}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      window.location.reload();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error updating status",
        description: (error as Error).message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }
  const [isFavorite, setIsFavorite] = React.useState(false);

  React.useEffect(() => {
    if (address) {
      const favorites = JSON.parse(localStorage.getItem(`favorites_${address}`) || '{}');
      const compositeKey = `${CHARITY_NFT_COLLECTION_ADDRESS}_${nft.metadata.id}`;
      setIsFavorite(!!favorites[compositeKey]);
    }
  }, [address, nft.metadata.id]);

  const toggleFavorite = () => {
    if (!address) return;

    const favorites = JSON.parse(localStorage.getItem(`favorites_${address}`) || '{}');
    const newFavorites = { ...favorites };
    const compositeKey = `${CHARITY_NFT_COLLECTION_ADDRESS}_${nft.metadata.id}`;

    if (isFavorite) {
      delete newFavorites[compositeKey];
    } else {
      newFavorites[compositeKey] = {
        id: nft.metadata.id,
        name: nft.metadata.name,
        image: nft.metadata.image,
        contractAddress: CHARITY_NFT_COLLECTION_ADDRESS
      };
    }

    localStorage.setItem(`favorites_${address}`, JSON.stringify(newFavorites));
    window.dispatchEvent(new Event('storage'));
    setIsFavorite(!isFavorite);

  };

  return (
    <Container maxW={"1200px"} p={5} my={5}>
      <SimpleGrid columns={2} spacing={6}>
        <Stack spacing={"20px"}>
          <Box borderRadius={"6px"} overflow={"hidden"}>
            <Skeleton isLoaded={!loadingMarketplace && !loadingDirectListing}>
              <ThirdwebNftMedia
                metadata={nft.metadata}
                width="100%"
                height="100%"
              />
            </Skeleton>
          </Box>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box>
              <Text fontWeight={"bold"}>Description:</Text>
              <Text>{nft.metadata.description}</Text>
            </Box>

            <Box>
              <Text fontWeight={"bold"}>Status:</Text>
              <Badge colorScheme={statusColor}>{statusText}</Badge>
            </Box>

            <Box>
              <Text fontWeight={"bold"}>Daily Donation:</Text>
              <Text> {ethers.utils.formatEther(String(nft.metadata?.pay || "0"))} ETH</Text>
            </Box>

            <Box>
              <Text fontWeight={"bold"}>Total Donated:</Text>
              <Text>{ethers.utils.formatEther(String(nft.metadata?.sum || "0"))} ETH </Text>
            </Box>

            <Box>
              <Text fontWeight={"bold"}>Rank:</Text>
              <Badge colorScheme={
                nft.metadata?.rank === "Gold" ? "yellow" :
                  nft.metadata?.rank === "Silver" ? "gray" :
                    nft.metadata?.rank === "Bronze" ? "orange" : "purple"
              }>
                {typeof nft.metadata?.rank === "string" ? nft.metadata.rank : "Unknown"}
              </Badge>
            </Box>
          </SimpleGrid>
          <Box paddingBottom={"50px"}>
            <SimpleGrid columns={2} spacing={4}>
              {Object.entries(nft?.metadata.attributes || {}).map(
                ([key, value]) => {
                  const trait = value as { trait_type: string; value: string | number };
                  return (
                    <Flex
                      key={key}
                      direction={"column"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      borderWidth={1}
                      p={"8px"}
                      borderRadius={"4px"}
                    >
                      <Text fontSize={"small"}>{trait.trait_type}</Text>
                      <Text fontSize={"small"} fontWeight={"bold"}>
                        {trait.value}
                      </Text>
                    </Flex>
                  );
                })}
            </SimpleGrid>
          </Box>
        </Stack>

        <Stack spacing={"20px"}>
          <Box>
            <Button onClick={() => router.back()} colorScheme="gray" size="sm">
              ← Back
            </Button>
            <Tooltip label={isFavorite ? "Remove from favorites" : "Add to favorites"}>
              <IconButton marginLeft={2}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                icon={isFavorite ? <FaStar color="gold" /> : <FaRegStar />}
                onClick={toggleFavorite}
                size="sm"
                variant="outline"
              />
            </Tooltip>
          </Box>

          {contractMetadata && (
            <Flex alignItems={"center"}>
              <Box borderRadius={"4px"} overflow={"hidden"} mr={"10px"}>
                <MediaRenderer
                  src={contractMetadata.image}
                  height="32px"
                  width="32px"
                />
              </Box>
              <Text fontWeight={"bold"}>{contractMetadata.name}</Text>
            </Flex>
          )}

          <Box mx={2.5}>
            <Text fontSize={"4xl"} fontWeight={"bold"}>{nft.metadata.name}</Text>
            <Link href={`/profile/${nft.owner}`}>
              <Flex direction={"row"} alignItems={"center"}>
                <Avatar src='https://bit.ly/broken-link' h={"24px"} w={"24px"} mr={"10px"} />
                <Text fontSize={"small"}>{nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}</Text>
              </Flex>
            </Link>
          </Box>

          <Web3Button
            contractAddress={APP_CHARITY_CONTRACT_ADDRESS}
            action={togglePauseStatus}
          >
            {isPaused ? "Activate NFT" : "Pause NFT"}
          </Web3Button>

          <Box mt={4}>
            <Button
              colorScheme="green"
              onClick={handleDonate}
              isLoading={isDonating}
              loadingText="Processing..."
              isDisabled={nft.metadata?.status === "0"}
            >
              {`Donate ${formatDonationAmount(String(nft.metadata?.pay || "0"))} ETH`}
            </Button>
            {nft.metadata?.status === "0" && (
              <Text mt={2} color="yellow.500">
                Donations are currently paused for this NFT
              </Text>
            )}
          </Box>
        </Stack>
      </SimpleGrid>
    </Container>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const tokenId = context.params?.tokenId as string;
  const sdk = new ThirdwebSDK("sepolia");

  try {
    const contract: SmartContract = await sdk.getContract(CHARITY_NFT_COLLECTION_ADDRESS);

    const nft: NFT = await contract.erc721.get(tokenId);

    const contractMetadata = await contract.metadata.get() as {
      description?: string;
      image?: string;
      name?: string;
    };

    return {
      props: {
        nft,
        contractMetadata: {
          description: contractMetadata.description ?? "No description available",
          image: contractMetadata.image ?? null,
          name: contractMetadata.name ?? "Unnamed Collection",
        },
      },
      revalidate: 1,
    };
  } catch (e) {
    console.error("Error fetching NFT or metadata:", e);
    return {
      notFound: true,
    };
  }
};
export const getStaticPaths: GetStaticPaths = async () => {
  const sdk = new ThirdwebSDK("sepolia");
  const contract: SmartContract = await sdk.getContract(CHARITY_NFT_COLLECTION_ADDRESS);

  const nfts: NFT[] = await contract.erc721.getAll();

  const paths = nfts.map((nft) => ({
    params: {
      contractAddress: CHARITY_NFT_COLLECTION_ADDRESS,
      tokenId: nft.metadata.id,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export default TokenPage;
