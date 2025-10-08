import type { NFT as NFTType } from "@thirdweb-dev/sdk";
import { SimpleGrid, Skeleton, Text, Link } from "@chakra-ui/react";
import NFT from "../NFTs/food_NFT"
import { FOOD_NFT_COLLECTION_ADDRESS } from "../../const/addresses";
import { useAddress } from "@thirdweb-dev/react";

type Props = {
    isLoading: boolean;
    data: NFTType[] | undefined;
    overrideOnclickBehavior?: (nft: NFTType) => void;
    emptyText?: string;
    onFavoriteChange?: () => void;
}

export default function FoodNFTGrid({
    isLoading,
    data,
    overrideOnclickBehavior,
    emptyText = "No NFTs found",
}: Props) {
    const address = useAddress();
    if (!address) {
                return <Text>Connect your wallet to view collection.</Text>;
            }
    return (
        <SimpleGrid columns={4} spacing={6} w={"100%"} padding={2.5} my={5}>
            {isLoading ? (
                [...Array(20)].map((_, index) => (
                    <Skeleton key={index} height={"312px"} width={"100%"} />
                ))
            ) : data && data.length > 0 ? (
                data.map((nft) =>
                    !overrideOnclickBehavior ? (
                        <Link
                            href={`/food_delivery/token_food/${FOOD_NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`}
                            key={nft.metadata.id}
                        >
                            <NFT nft={nft} contractAddress={""} />
                        </Link>
                    ) : (
                        <div
                            key={nft.metadata.id}
                            onClick={() => overrideOnclickBehavior(nft)}
                        >
                            <NFT nft={nft} contractAddress={""}  />
                        </div>
                    )
                )
            ) : (
                <Text>{emptyText}</Text>
            )}
        </SimpleGrid>
    );
}