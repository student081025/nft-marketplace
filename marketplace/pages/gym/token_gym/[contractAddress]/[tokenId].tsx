import { Avatar, Box, Container, Flex, Input, SimpleGrid, Skeleton, Stack, Text, Button } from "@chakra-ui/react";
import { MediaRenderer, ThirdwebNftMedia, Web3Button, useContract, useMinimumNextBid, useValidDirectListings, useValidEnglishAuctions } from "@thirdweb-dev/react";
import { NFT, ThirdwebSDK } from "@thirdweb-dev/sdk";
import React, { useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from 'next/router';
import { FaStar, FaRegStar } from "react-icons/fa";
import { useAddress } from "@thirdweb-dev/react";
import { Tooltip, IconButton } from "@chakra-ui/react";

type Props = {
    nft: NFT;
    contractMetadata: any;
};

export const MARKETPLACE_ADDRESS = "0xe73486152961244Dbe5a96b032A999c37694F1b6";

export const GYM_NFT_COLLECTION_ADDRESS = "0x699EDCdEA43BB51c69c8adEC48CBc1D6858eA9C0";

export default function TokenPage({ nft, contractMetadata }: Props) {
    const { contract: marketplace, isLoading: loadingMarketplace } =
        useContract(
            MARKETPLACE_ADDRESS,
            "marketplace-v3"
        );

    const { contract: nftCollection } = useContract(GYM_NFT_COLLECTION_ADDRESS);
    const router = useRouter();
    const address = useAddress();
    const [isFavorite, setIsFavorite] = React.useState(false);

    React.useEffect(() => {
        if (address) {
            const favorites = JSON.parse(localStorage.getItem(`favorites_${address}`) || '{}');
            const compositeKey = `${GYM_NFT_COLLECTION_ADDRESS}_${nft.metadata.id}`;
            setIsFavorite(!!favorites[compositeKey]);
        }
    }, [address, nft.metadata.id]);

    // In your TokenPage component, update the toggleFavorite function:
    const toggleFavorite = () => {
        if (!address) return;

        const favorites = JSON.parse(localStorage.getItem(`favorites_${address}`) || '{}');
        const newFavorites = { ...favorites };
        const compositeKey = `${GYM_NFT_COLLECTION_ADDRESS}_${nft.metadata.id}`;

        if (isFavorite) {
            delete newFavorites[compositeKey];
        } else {
            newFavorites[compositeKey] = {
                id: nft.metadata.id,
                name: nft.metadata.name,
                image: nft.metadata.image,
                contractAddress: GYM_NFT_COLLECTION_ADDRESS
            };
        }

        localStorage.setItem(`favorites_${address}`, JSON.stringify(newFavorites));
        window.dispatchEvent(new Event('storage'));
        setIsFavorite(!isFavorite);

    };
    const { data: directListing, isLoading: loadingDirectListing } =
        useValidDirectListings(marketplace, {
            tokenContract: GYM_NFT_COLLECTION_ADDRESS,
            tokenId: nft.metadata.id,
        });

    const [bidValue, setBidValue] = useState<string>();

    const { data: auctionListing, isLoading: loadingAuction } =
        useValidEnglishAuctions(marketplace, {
            tokenContract: GYM_NFT_COLLECTION_ADDRESS,
            tokenId: nft.metadata.id,
        });


    async function buyListing() {
        let txResult;

        if (auctionListing?.[0]) {
            txResult = await marketplace?.englishAuctions.buyoutAuction(
                auctionListing[0].id,
            );
        } else if (directListing?.[0]) {
            txResult = await marketplace?.directListings.buyFromListing(
                directListing[0].id,
                1
            );
        } else {
            throw new Error("No listing found");
        }

        return txResult;
    }

    async function createBidOffer() {
        let txResult;
        if (!bidValue) {
            return;
        }

        if (auctionListing?.[0]) {
            txResult = await marketplace?.englishAuctions.makeBid(
                auctionListing[0].id,
                bidValue
            );
        } else if (directListing?.[0]) {
            txResult = await marketplace?.offers.makeOffer({
                assetContractAddress: GYM_NFT_COLLECTION_ADDRESS,
                tokenId: nft.metadata.id,
                totalPrice: bidValue,
            })
        } else {
            throw new Error("No listing found");
        }
        return txResult;
    }

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
                    <Box>
                        <Text fontWeight={"bold"}>Description:</Text>
                        <Text>{nft.metadata.description}</Text>
                    </Box>
                    <Box paddingBottom={"70px"}>
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
                    <Box display="flex" alignItems="center" gap={2} mb={4}>
                        <Button onClick={() => router.back()} colorScheme="gray" size="sm">
                            ← Back
                        </Button>
                        <Tooltip label={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                            <IconButton
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
                        <Link
                            href={`/profile/${nft.owner}`}
                        >
                            <Flex direction={"row"} alignItems={"center"}>
                                <Avatar src='https://bit.ly/broken-link' h={"24px"} w={"24px"} mr={"10px"} />
                                <Text fontSize={"small"}>{nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}</Text>
                            </Flex>
                        </Link>
                    </Box>

                    <Stack backgroundColor={"#EEE"} p={2.5} borderRadius={"6px"}>
                        <Text color={"darkgray"}>Price:</Text>
                        <Skeleton isLoaded={!loadingMarketplace && !loadingDirectListing}>
                            {directListing && directListing[0] ? (
                                <Text fontSize={"3xl"} fontWeight={"bold"}>
                                    {directListing[0]?.currencyValuePerToken.displayValue}
                                    {" " + directListing[0]?.currencyValuePerToken.symbol}
                                </Text>
                            ) : auctionListing && auctionListing[0] ? (
                                <Text fontSize={"3xl"} fontWeight={"bold"}>
                                    {auctionListing[0]?.buyoutCurrencyValue.displayValue}
                                    {" " + auctionListing[0]?.buyoutCurrencyValue.symbol}
                                </Text>
                            ) : (
                                <Text fontSize={"3xl"} fontWeight={"bold"}>Not for sale</Text>
                            )}
                        </Skeleton>
                        <Skeleton isLoaded={!loadingAuction}>
                            {auctionListing && auctionListing[0] && (
                                <Flex direction={"column"}>
                                    <Text color={"darkgray"}>Bids starting from</Text>
                                    <Text fontSize={"3xl"} fontWeight={"bold"}>
                                        {auctionListing[0]?.minimumBidCurrencyValue.displayValue}
                                        {" " + auctionListing[0]?.minimumBidCurrencyValue.symbol}
                                    </Text>
                                    <Text></Text>
                                </Flex>
                            )}

                        </Skeleton>
                    </Stack>
                    <Skeleton isLoaded={!loadingMarketplace || !loadingDirectListing || !loadingAuction}>
                        <Web3Button
                            contractAddress={MARKETPLACE_ADDRESS}
                            action={async () => buyListing()}
                            isDisabled={(!auctionListing || !auctionListing[0]) && (!directListing || !directListing[0])}
                        >Buy at asking price</Web3Button>
                        <Text textAlign={"center"}>or</Text>
                        <Flex direction={"column"}>
                            <Input
                                mb={5}
                                defaultValue={
                                    auctionListing?.[0]?.minimumBidCurrencyValue?.displayValue || 0
                                }
                                type={"number"}
                                onChange={(e) => setBidValue(e.target.value)}
                            />
                            <Web3Button
                                contractAddress={MARKETPLACE_ADDRESS}
                                action={async () => await createBidOffer()}
                                isDisabled={!auctionListing || !auctionListing[0]}
                            >Place Bid</Web3Button>
                        </Flex>
                    </Skeleton>
                </Stack>
            </SimpleGrid>

        </Container>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    const tokenId = context.params?.tokenId as string;

    let sdk;
    try {
        sdk = new ThirdwebSDK("sepolia");
    } catch (e) {
        console.error("SDK init failed:", e);
        return { notFound: true };
    }

    try {
        const contract = await sdk.getContract(GYM_NFT_COLLECTION_ADDRESS);

        // If contract is undeployed, this will fail
        const [nft, metadata] = await Promise.all([
            contract.erc721.get(tokenId),
            contract.metadata.get().catch(() => null),
        ]);

        if (!nft) return { notFound: true };

        return {
            props: {
                nft,
                contractMetadata: {
                    description: metadata?.description || "No description",
                    image: metadata?.image || null,
                    name: metadata?.name || "Unnamed Collection",
                },
            },
            revalidate: 60,
        };
    } catch (err: any) {
        console.error("Fetching NFT failed:", err);
        return { notFound: true };
    }
};


// export const getStaticPaths: GetStaticPaths = async () => {
//     const sdk = new ThirdwebSDK("sepolia");
//     const contract = await sdk.getContract(GYM_NFT_COLLECTION_ADDRESS);

//     // Only fetch the first 50 NFTs for static generation
//     const nfts = await contract.erc721.getAll({ count: 50 });

//     const paths = nfts.map((nft) => ({
//         params: {
//             contractAddress: GYM_NFT_COLLECTION_ADDRESS,
//             tokenId: nft.metadata.id.toString(),
//         },
//     }));

//     return {
//         paths,
//         fallback: 'blocking', // Keep this for new NFTs
//     };
// };

export const getStaticPaths: GetStaticPaths = async () => {
    const sdk = new ThirdwebSDK("sepolia");

    try {
        const contract = await sdk.getContract(GYM_NFT_COLLECTION_ADDRESS);
        const nfts = await contract.erc721.getAll({ count: 50 });

        const paths = nfts.map((nft) => ({
            params: {
                contractAddress: GYM_NFT_COLLECTION_ADDRESS,
                tokenId: nft.metadata.id.toString(),
            },
        }));

        return {
            paths,
            fallback: 'blocking',
        };
    } catch (err) {
        console.error("Failed to get static paths:", err);
        return {
            paths: [],
            fallback: 'blocking',
        };
    }
};