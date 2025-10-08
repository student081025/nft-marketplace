import { VStack, Box, Button, Card, Container, Flex, Heading, SimpleGrid, Stack, Text, Alert, AlertIcon } from "@chakra-ui/react";
import { ThirdwebNftMedia, useAddress, useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import React, { useState } from "react";
import { GYM_NFT_COLLECTION_ADDRESS } from "../../const/addresses";
import type { NFT as NFTType } from "@thirdweb-dev/sdk";
import GymNFTGrid from "../../components_new/NFTGrids/gym_NFTGrid";
import SaleInfo from "../../components_new/SaleInfos/gym_SaleInfo";
import Link from "next/link";
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';

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

const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: { duration: 0.5 },
    },
};

export default function Sell() {
    const { contract } = useContract(GYM_NFT_COLLECTION_ADDRESS);
    const address = useAddress();
    const { data, isLoading } = useOwnedNFTs(contract, address);

    const [selectedNFT, setSelectedNFT] = useState<NFTType>();

    if (!address) {
        return (
            <Container maxW={"1200px"} p={5}>
                <Heading marginBottom={"1rem"}>Sell NFTs</Heading>
                <Alert status="warning" borderRadius="md" mb={5}>
                    <AlertIcon />
                    You have to login or sign up to sell NFTs
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
        >
            <Container maxW="1400px" py={12} as={motion.div} variants={containerVariants} initial="hidden" animate="visible">
                <VStack spacing={6} textAlign="center" mb={12}>
                    <Heading
                        as={motion.h1}
                        variants={itemVariants}
                        fontSize={{ base: '4xl', md: '6xl' }}
                        color="whiteAlpha.800"
                        textShadow="0 4px 30px rgba(0,0,0,0.15)"
                        fontWeight="extrabold"
                    >
                        Sell Your NFTs
                    </Heading>
                    <Text
                        as={motion.p}
                        variants={itemVariants}
                        fontSize={{ base: 'lg', md: 'xl' }}
                        color="whiteAlpha.800"
                        maxW="600px"
                    >
                        Select which NFT you want to sell from your collection below.
                    </Text>
                </VStack>
                <Box
                    as={motion.div}
                    variants={itemVariants}
                    bg="white"
                    backdropFilter="blur(10px)"
                    borderRadius="3xl"
                    p={8}
                    border="1px solid"
                    borderColor="whiteAlpha.300"
                >
                    {!selectedNFT ? (
                        <GymNFTGrid
                            data={data}
                            isLoading={isLoading}
                            overrideOnclickBehavior={(nft) => {
                                setSelectedNFT(nft);
                            }}
                            emptyText={"You do not own any NFTs yet from this collection."}
                        />
                    ) : (
                        <Flex justifyContent={"center"} my={10}>
                            <Box
                                overflow="hidden"
                               >
                                <SimpleGrid columns={2} spacing={10} p={5}>
                                    <ThirdwebNftMedia
                                        metadata={selectedNFT.metadata}
                                        width="100%"
                                        height="100%"
                                    />
                                    <Stack>
                                        <Flex justifyContent={"right"}>
                                            <Button
                                                onClick={() => {
                                                    setSelectedNFT(undefined);
                                                }}
                                            >X</Button>
                                        </Flex>
                                        <Heading>{selectedNFT.metadata.name}</Heading>
                                        <SaleInfo
                                            nft={selectedNFT}
                                        />
                                    </Stack>
                                </SimpleGrid>
                            </Box>
                        </Flex>
                    )}
                </Box>
            </Container>
        </Box>
    )
}