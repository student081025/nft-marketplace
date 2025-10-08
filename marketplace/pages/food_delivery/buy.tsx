import React, { useState, useEffect } from "react";
import { Alert, AlertIcon, Container, Heading, Text, Select, Flex, Box, Center, VStack } from "@chakra-ui/react";
import FoodNFTGrid from "../../components_new/NFTGrids/food_NFTGrid";
import { FOOD_NFT_COLLECTION_ADDRESS, MARKETPLACE_ADDRESS } from "../../const/addresses";
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
    const { contract } = useContract(FOOD_NFT_COLLECTION_ADDRESS);
    const { data: nfts, isLoading } = useNFTs(contract);
    const { contract: marketplace } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");
    const [sortOption, setSortOption] = useState<string>("default");
    const [sortedNFTs, setSortedNFTs] = useState<NFTType[] | undefined>(undefined);

    const { data: directListings } = useValidDirectListings(marketplace, {
        tokenContract: FOOD_NFT_COLLECTION_ADDRESS,
    });
    const { data: auctionListings } = useValidEnglishAuctions(marketplace, {
        tokenContract: FOOD_NFT_COLLECTION_ADDRESS,
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
            price: priceMap.get(nft.metadata.id) || 0
        }));

        let sorted;
        switch (sortOption) {
            case "priceLowHigh":
                sorted = [...nftsWithPrices].sort((a, b) => a.price - b.price);
                break;
            case "priceHighLow":
                sorted = [...nftsWithPrices].sort((a, b) => b.price - a.price);
                break;
            default:
                sorted = nfts;
        }
        setSortedNFTs(sorted);
    }, [nfts, sortOption, directListings, auctionListings]);

        const address = useAddress();
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
                        Reimagine Mealtime Convenience
                    </Heading>
                    <Text
                        as={motion.p}
                        variants={itemVariants}
                        fontSize={{ base: 'lg', md: 'xl' }}
                        color="whiteAlpha.800"
                        maxW="800px"
                    >
                        Subscription-based food delivery that gives you ultimate control, variety, and value
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
                                Why Food Delivery Subscriptions?
                            </Heading>
                            <Text color="whiteAlpha.800">
                                Tired of overpriced takeout and last-minute grocery runs?
                                Our flexible food delivery subscriptions bring chef-crafted meals
                                right to your doorstep—fresh, fast, and on your schedule.
                            </Text>
                            <Text color="whiteAlpha.800">
                                Skip the stress of meal planning. Enjoy curated menus,
                                healthier choices, and consistent quality—all while saving time and money.
                            </Text>
                            <Text color="whiteAlpha.800" fontWeight="bold">
                                Pause, upgrade, or cancel anytime. No hidden fees. No hassle.
                                Just great food, delivered your way.
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

                    <FoodNFTGrid
                        isLoading={isLoading}
                        data={sortedNFTs || nfts}
                        emptyText={"No NFTs found"} />
                </Box>
                <Center mt={12}>
                    <Box textAlign="center" maxW="800px">
                        <Heading size="lg" color="white" mb={4}>
                            Hungry for a better way to eat?
                        </Heading>
                        <Text fontSize="xl" color="whiteAlpha.800" mb={6}>
                            Explore our plans and discover the smarter,
                            tastier way to fuel your day.
                        </Text>
                    </Box>
                </Center>

            </Container>
        </Box>
    );
}