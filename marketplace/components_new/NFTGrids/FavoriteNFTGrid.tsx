import { Box, Flex, SimpleGrid, Skeleton, Text, Tabs, Tab, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import { NFT } from "@thirdweb-dev/sdk";
import GymNFTComponent from "../NFTs/gym_NFT";
import FoodNFTComponent from "../NFTs/food_NFT";
import CharityNFTComponent from "../NFTs/charity_NFT";
import { useAddress } from "@thirdweb-dev/react";
import React, { useState, useEffect } from "react";
import {
    MARKETPLACE_ADDRESS,
    GYM_NFT_COLLECTION_ADDRESS,
    FOOD_NFT_COLLECTION_ADDRESS,
    CHARITY_NFT_COLLECTION_ADDRESS,
} from "../../const/addresses";

type Props = {
    isLoading: boolean;
    data: NFT[];
    emptyText?: string;
};

export default function FavoriteNFTGrid() {
    const address = useAddress();
    const [favorites, setFavorites] = React.useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        if (address) {
            const favs = JSON.parse(localStorage.getItem(`favorites_${address}`) || '{}');
            setFavorites(favs);
            setIsLoading(false);
        }
    }, [address]);

    const [activeTab, setActiveTab] = useState(0);

    // Separate favorites by collection
    const gymFavorites = Object.values(favorites).filter(
        (fav) => fav.contractAddress === GYM_NFT_COLLECTION_ADDRESS
    );
    const foodFavorites = Object.values(favorites).filter(
        (fav) => fav.contractAddress === FOOD_NFT_COLLECTION_ADDRESS
    );
    const charityFavorites = Object.values(favorites).filter(
        (fav) => fav.contractAddress === CHARITY_NFT_COLLECTION_ADDRESS
    );

    if (!address) {
        return <Text>Connect your wallet to view favorites.</Text>;
    }

    if (isLoading) {
        return (
            <SimpleGrid columns={4} spacing={6} w={"100%"}>
                {[...Array(4)].map((_, index) => (
                    <Skeleton key={index} height={"312px"} width={"100%"} borderRadius={"8px"} />
                ))}
            </SimpleGrid>
        );
    }

    if (Object.keys(favorites).length === 0) {
        return <Text>No favorites yet</Text>;
    }

    return (
        <Box width="100%">
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
                    <TabPanel>
                        <SimpleGrid columns={4} spacing={6} w={"100%"}>
                            {gymFavorites.map((fav) => {
                                const metadata = {
                                    id: fav.id.toString(),
                                    uri: "",
                                    description: fav.description || "",
                                    image: fav.image || "",
                                    external_url: "",
                                    animation_url: "",
                                    background_color: "",
                                    properties: {},
                                    attributes: {},
                                };

                                return (
                                    <GymNFTComponent
                                        key={`${fav.contractAddress}_${fav.id}`}
                                        nft={{
                                            metadata,
                                            owner: "",
                                            type: "ERC721",
                                            supply: "1"
                                        }}
                                        contractAddress={fav.contractAddress}
                                    />
                                );
                            })}
                        </SimpleGrid>
                    </TabPanel>
                    <TabPanel>
                        <SimpleGrid columns={4} spacing={6} w={"100%"}>
                            {foodFavorites.map((fav) => {
                                const metadata = {
                                    id: fav.id.toString(),
                                    uri: "", 
                                    description: fav.description || "",
                                    image: fav.image || "",
                                    external_url: "",
                                    animation_url: "",
                                    background_color: "",
                                    properties: {},
                                    attributes: {},
                                };

                                return (
                                    <FoodNFTComponent
                                        key={`${fav.contractAddress}_${fav.id}`}
                                        nft={{
                                            metadata,
                                            owner: "",
                                            type: "ERC721",
                                            supply: "1"
                                        }}
                                        contractAddress={fav.contractAddress}
                                    />
                                );
                            })}
                        </SimpleGrid>
                    </TabPanel>
                    <TabPanel>
                        <SimpleGrid columns={4} spacing={6} w={"100%"}>
                            {charityFavorites.map((fav) => {
                                const metadata = {
                                    id: fav.id.toString(),
                                    uri: "",
                                    description: fav.description || "",
                                    image: fav.image || "",
                                    external_url: "",
                                    animation_url: "",
                                    background_color: "",
                                    properties: {},
                                    attributes: {},
                                };

                                return (
                                    <CharityNFTComponent
                                        key={`${fav.contractAddress}_${fav.id}`}
                                        nft={{
                                            metadata,
                                            owner: "",
                                            type: "ERC721",
                                            supply: "1"
                                        }}
                                        contractAddress={fav.contractAddress}
                                    />
                                );
                            })}
                        </SimpleGrid>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
}