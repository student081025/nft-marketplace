import React, { useState, useEffect } from "react";
import { NFT } from "@thirdweb-dev/sdk";
import { MARKETPLACE_ADDRESS } from "../../const/addresses";
import { ThirdwebNftMedia, useContract, useValidDirectListings, useValidEnglishAuctions, useAddress } from "@thirdweb-dev/react";
import { Box, Flex, Skeleton, Text, HStack, Stack, Badge, Tooltip } from "@chakra-ui/react";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";

type Props = {
    nft: NFT;
    contractAddress: string;
    onClick?: () => void;
};

export default function CharityNFTComponent({ nft, contractAddress, onClick }: Props) {
    const address = useAddress();
    const [isFavorite, setIsFavorite] = useState(false);

    const currentStatus = nft.metadata?.status;
    const isPaused = currentStatus === "0";
    const statusText = isPaused ? "Paused" : "Active";
    const statusColor = isPaused ? "red" : "green";

    const { contract: marketplace, isLoading: loadingMarketplace } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");

    const { data: directListing, isLoading: loadingDirectListing } =
        useValidDirectListings(marketplace, {
            tokenContract: contractAddress,
            tokenId: nft.metadata.id,
        });

    const { data: auctionListing, isLoading: loadingAuction } =
        useValidEnglishAuctions(marketplace, {
            tokenContract: contractAddress,
            tokenId: nft.metadata.id,
        });

     useEffect(() => {
             if (address) {
                 const favorites = JSON.parse(localStorage.getItem(`favorites_${address}`) || '{}');
                 const compositeKey = `${contractAddress}_${nft.metadata.id}`;
                 setIsFavorite(!!favorites[compositeKey]);
             }
         }, [address, contractAddress, nft.metadata.id]);
     
         const toggleFavorite = () => {
             if (!address) return;
     
             const favorites = JSON.parse(localStorage.getItem(`favorites_${address}`) || '{}');
             const newFavorites = { ...favorites };
             const compositeKey = `${contractAddress}_${nft.metadata.id}`;
     
             if (isFavorite) {
                 delete newFavorites[compositeKey];
             } else {
                 newFavorites[compositeKey] = {
                     id: nft.metadata.id,
                     name: nft.metadata.name,
                     image: nft.metadata.image,
                     contractAddress: contractAddress
                 };
             }
     
             localStorage.setItem(`favorites_${address}`, JSON.stringify(newFavorites));
             setIsFavorite(!isFavorite);
         };
         
    return (
        <Box width="100%" position="relative">
          {isFavorite && (
                          <Tooltip label="Favorited" placement="top">
                              <Badge 
                                  position="absolute" 
                                  top="2" 
                                  right="2" 
                                  zIndex="1"
                                  colorScheme="yellow"
                                  borderRadius="full"
                                  px={2}
                                  py={1}
                                  display="flex"
                                  alignItems="center"
                                  gap={1}
                              >
                                  <FaStar size="12px" />
                                  <Text fontSize="xs">Favorited</Text>
                              </Badge>
                          </Tooltip>
                      )}
          <Flex 
            direction="column" 
            p={0}
            onClick={onClick}
            cursor={onClick ? "pointer" : "default"}
            _hover={onClick ? { transform: "translateY(-2px)" } : {}}
            transition="transform 0.2s"
            width="100%"
          >
            <Box 
              width="100%"
              borderRadius="4px 4px 0 0"
              overflow="hidden"
            >
              <ThirdwebNftMedia 
                metadata={nft.metadata} 
                height="100%" 
                width="100%" 
              />
            </Box>
      
            <Box p={3}>
              <Text fontSize="sm" color="gray.500">Token ID #{nft.metadata.id}</Text>
              <Text fontWeight="bold" mb={2} noOfLines={1}>{nft.metadata.name}</Text>
              
              {loadingMarketplace || loadingDirectListing || loadingAuction ? (
                <Skeleton height="20px" width="50%" />
              ) : directListing && directListing[0] ? (
                <Text fontSize="sm">
                  Price: {directListing[0]?.currencyValuePerToken.displayValue} {directListing[0]?.currencyValuePerToken.symbol}
                </Text>
              ) : auctionListing && auctionListing[0] ? (
                <Text fontSize="sm">
                  Min Bid: {auctionListing[0]?.minimumBidCurrencyValue.displayValue} {auctionListing[0]?.minimumBidCurrencyValue.symbol}
                </Text>
              ) : (
                <Text fontSize="sm">Not listed</Text>
              )}
            </Box>
          </Flex>
        </Box>
      );
}