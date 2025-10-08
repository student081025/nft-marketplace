import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Stack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  VStack
} from "@chakra-ui/react";
import {
  useContract,
  useOwnedNFTs,
  useAddress,
} from "@thirdweb-dev/react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import GymNFTGrid from "../../components_new/NFTGrids/gym_NFTGrid";
import FoodNFTGrid from "../../components_new/NFTGrids/food_NFTGrid";
import CharityNFTGrid from "../../components_new/NFTGrids/charity_NFTGrid";
import FavoriteNFTGrid from "../../components_new/NFTGrids/FavoriteNFTGrid";

import {
  MARKETPLACE_ADDRESS,
  GYM_NFT_COLLECTION_ADDRESS,
  FOOD_NFT_COLLECTION_ADDRESS,
  CHARITY_NFT_COLLECTION_ADDRESS,
} from "../../const/addresses";
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

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const address = useAddress();
  const [activeTab, setActiveTab] = useState(0);

  const { contract: gymCollection } = useContract(GYM_NFT_COLLECTION_ADDRESS);
  const { contract: foodCollection } = useContract(FOOD_NFT_COLLECTION_ADDRESS);
  const { contract: charityCollection } = useContract(CHARITY_NFT_COLLECTION_ADDRESS);
  const { contract: marketplace } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");

  const { data: gymNFTs, isLoading: loadingGymNfts } = useOwnedNFTs(
    gymCollection,
    router.query.address as string
  );
  const { data: foodNFTs, isLoading: loadingFoodNfts } = useOwnedNFTs(
    foodCollection,
    router.query.address as string
  );
  const { data: charityNFTs, isLoading: loadingCharityNfts } = useOwnedNFTs(
    charityCollection,
    router.query.address as string
  );
  const [favorites, setFavorites] = useState<Record<string, any>>({});
  
  useEffect(() => {
    const handleStorageChange = () => {
        if (address) {
          const favs = JSON.parse(localStorage.getItem(`favorites_${address}`) || '{}');
          setFavorites(favs);
        }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
}, [address]);

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
        <VStack spacing={4} textAlign="center" mb={8}>
          <Heading
            as={motion.h1}
            variants={itemVariants}
            fontSize={{ base: '2xl', md: '3xl' }}
            color="whiteAlpha.800"
            textShadow="0 4px 30px rgba(0,0,0,0.15)"
            fontWeight="extrabold"
            marginTop={-10}
          >
            Your Favourited Collection
          </Heading>
          <Text
            as={motion.p}
            variants={itemVariants}
            fontSize={{ base: 'lg', md: 'xl' }}
            color="whiteAlpha.800"
            maxW="800px"
          >
            Discover and manage your saved NFTs in one convenient place.
          </Text>
        </VStack>

        <Box
          as={motion.div}
          variants={itemVariants}
          bg="whiteAlpha.800"
          backdropFilter="blur(10px)"
          borderRadius="3xl"
          p={6}
          border="1px solid"
          borderColor="whiteAlpha.300"
          maxW="1200px"
          mx="auto"
          mb={12}
        >
          <FavoriteNFTGrid />
        </Box>

        <VStack spacing={4} textAlign="center" mb={8}>
          <Heading
            as={motion.h1}
            variants={itemVariants}
            fontSize={{ base: '2xl', md: '3xl' }}
            color="whiteAlpha.800"
            textShadow="0 4px 30px rgba(0,0,0,0.15)"
            fontWeight="extrabold"
          >
            Your Own NFT Collection
          </Heading>
          <Text
            as={motion.p}
            variants={itemVariants}
            fontSize={{ base: 'lg', md: 'xl' }}
            color="whiteAlpha.800"
            maxW="800px"
          >
            Manage your NFT collection across different categories.
          </Text>
        </VStack>

        <Box
          as={motion.div}
          variants={itemVariants}
          bg="whiteAlpha.800"
          backdropFilter="blur(10px)"
          borderRadius="3xl"
          p={6}
          border="1px solid"
          borderColor="whiteAlpha.300"
          maxW="1200px"
          mx="auto"
        >
          <Box>
            <Flex direction="row" justify="space-between" align="center" width="100%">
              <Tabs variant="soft-rounded" colorScheme="blue" onChange={(index) => setActiveTab(index)} width="100%">
                <TabList>
                  <Tab _selected={{ bg: 'blue.500', color: 'white' }} px={6} py={3}>Gym</Tab>
                  <Tab _selected={{ bg: 'blue.500', color: 'white' }} px={6} py={3}>Food delivery</Tab>
                  <Tab _selected={{ bg: 'blue.500', color: 'white' }} px={6} py={3}>Charity</Tab>
                </TabList>
              </Tabs>
            </Flex>

            <Tabs index={activeTab} onChange={setActiveTab} isLazy>
              <TabPanels>
                <TabPanel px={0}>
                  <GymNFTGrid
                    data={gymNFTs}
                    isLoading={loadingGymNfts}
                    emptyText={"You do not own any NFTs yet from this collection"}
                  />
                </TabPanel>
                <TabPanel px={0}>
                  <FoodNFTGrid
                    data={foodNFTs}
                    isLoading={loadingFoodNfts}
                    emptyText={"You do not own any NFTs yet from this collection"}
                  />
                </TabPanel>
                <TabPanel px={0}>
                  <CharityNFTGrid
                    data={charityNFTs}
                    isLoading={loadingCharityNfts}
                    emptyText={"You do not own any NFTs yet from this collection"}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProfilePage;