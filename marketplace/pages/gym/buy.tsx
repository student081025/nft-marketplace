import React, { useState, useEffect } from "react";
import { Alert, AlertIcon, Center, VStack, Container, Heading, Text, Select, Flex, Box } from "@chakra-ui/react";
import GymNFTGrid from "../../components_new/NFTGrids/gym_NFTGrid";
import { GYM_NFT_COLLECTION_ADDRESS, MARKETPLACE_ADDRESS } from "../../const/addresses";
import { useAddress, useContract, useNFTs, useValidDirectListings, useValidEnglishAuctions } from "@thirdweb-dev/react";
import { NFT as NFTType } from "@thirdweb-dev/sdk";
import { keyframes } from "@emotion/react";
import { motion } from "framer-motion";

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5 },
    },
};

export default function Buy() {

    const { contract } = useContract(GYM_NFT_COLLECTION_ADDRESS);
    const address = useAddress();
    const { data: nfts, isLoading } = useNFTs(contract);
    const { contract: marketplace } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");
    const [sortOption, setSortOption] = useState<string>("default");
    const [sortedNFTs, setSortedNFTs] = useState<NFTType[] | undefined>(undefined);

    const { data: directListings } = useValidDirectListings(marketplace, {
        tokenContract: GYM_NFT_COLLECTION_ADDRESS,
    });
    const { data: auctionListings } = useValidEnglishAuctions(marketplace, {
        tokenContract: GYM_NFT_COLLECTION_ADDRESS,
    });

    useEffect(() => {
        if (!nfts) {
            setSortedNFTs(undefined);
            return;
        }

        const priceMap = new Map<string, number>();

        directListings?.forEach(listing => {
            priceMap.set(listing.tokenId, parseFloat(listing.currencyValuePerToken.displayValue));
        });

        auctionListings?.forEach(listing => {
            if (!priceMap.has(listing.tokenId)) {
                priceMap.set(listing.tokenId, parseFloat(listing.minimumBidCurrencyValue.displayValue));
            }
        });

        const nftsWithPrices = nfts.map(nft => ({
            ...nft,
            price: priceMap.get(nft.metadata.id) ?? null
        }));

        let sorted;
        switch (sortOption) {
            case "priceLowHigh":
                sorted = [...nftsWithPrices].sort((a, b) => {
                    const priceA = a.price === null ? Infinity : a.price;
                    const priceB = b.price === null ? Infinity : b.price;
                    return priceA - priceB;
                });
                break;
            case "priceHighLow":
                sorted = [...nftsWithPrices].sort((a, b) => {
                    const priceA = a.price === null ? -Infinity : a.price;
                    const priceB = b.price === null ? -Infinity : b.price;
                    return priceB - priceA;
                });
                break;
            default:
                sorted = nftsWithPrices;
        }

        setSortedNFTs(sorted);
    }, [nfts, sortOption, directListings, auctionListings]);


    if (!address) {
        return (
            <Container maxW={"1200px"} p={5}>
                <Alert status="warning" borderRadius="md" mb={5}>
                    <AlertIcon />
                    You have to login or sign up to buy NFTs
                </Alert>
                <Text>Connect your wallet to view and sell your NFTs.</Text>

            </Container>
        );
    }

    return (
        <Box
            minH="100vh"
            bgGradient="linear(to-br, #0F4C75, #3282B8, #BBE1FA)"
            css={{
                backgroundSize: '400% 400%',
                animation: `${gradient} 15s ease infinite`,
            }}
            position="relative"
            pt="80px"
            pb={12}
        >
            <Container
                maxW="1400px"
                py={12}
                as={motion.div}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <VStack spacing={6} textAlign="center" mb={12}>
                    <Heading
                        as={motion.h1}
                        variants={itemVariants}
                        fontSize={{ base: '4xl', md: '6xl' }}
                        color="whiteAlpha.800"
                        textShadow="0 4px 30px rgba(0,0,0,0.15)"
                        fontWeight="extrabold"
                    >
                        Revolutionize Your Gym Experience
                    </Heading>
                    <Text
                        as={motion.p}
                        variants={itemVariants}
                        fontSize={{ base: 'lg', md: 'xl' }}
                        color="whiteAlpha.800"
                        maxW="800px"
                    >
                        NFT-powered memberships that give you unprecedented freedom and flexibility
                    </Text>
                </VStack>
                <Center mb={12}>
                    <Box
                        bg="whiteAlpha.100"
                        backdropFilter="blur(10px)"
                        borderRadius="2xl"
                        p={8}
                        maxW="900px"
                        border="1px solid"
                        borderColor="whiteAlpha.300"
                        as={motion.div}
                        variants={itemVariants}
                    >
                        <VStack spacing={6} textAlign="center">
                            <Heading size="lg" color="white">
                                Why NFT Gym Memberships?
                            </Heading>
                            <Text color="whiteAlpha.800">
                                Traditional gym memberships lock you into rigid contracts with no flexibility.
                                With NFT memberships, you own your subscription as a digital asset that you
                                can sell or transfer anytime.
                            </Text>
                            <Text color="whiteAlpha.800">
                                For gym owners, NFT memberships eliminate paperwork, reduce administrative
                                costs, and create new revenue streams from secondary market transactions.
                            </Text>
                            <Text color="whiteAlpha.800" fontWeight="bold">
                                Your fitness journey, your rules. Buy, sell, or trade your membership
                                without restrictions.
                            </Text>
                        </VStack>
                    </Box>
                </Center>
                <Box
                    as={motion.div}
                    variants={itemVariants}
                    bg="whiteAlpha.800"
                    backdropFilter="blur(10px)"
                    borderRadius="3xl"
                    p={8}
                    border="1px solid"
                    borderColor="whiteAlpha.300"
                >
                    <Flex align="center" marginRight="1rem">
                        <Text whiteSpace="nowrap" mr={2}>Sort by:</Text>
                        <Select
                            width="200px"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="default">Default</option>
                            <option value="priceLowHigh">Price: Low to High</option>
                            <option value="priceHighLow">Price: High to Low</option>
                        </Select>
                    </Flex>

                    <GymNFTGrid
                        isLoading={isLoading}
                        data={sortedNFTs || nfts}
                        emptyText={"No NFTs found"} />
                </Box>
                <Center mt={12}>
                    <Box textAlign="center" maxW="800px">
                        <Heading size="lg" color="white" mb={4}>
                            Ready to Transform Your Fitness Journey?
                        </Heading>
                        <Text fontSize="xl" color="whiteAlpha.800" mb={6}>
                            Browse our collection of NFT gym memberships and experience the future
                            of flexible fitness subscriptions today.
                        </Text>
                    </Box>
                </Center>

            </Container>
        </Box>
    );
}
