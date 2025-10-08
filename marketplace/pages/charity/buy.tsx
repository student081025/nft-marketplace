import React, { useState } from "react";
import {
  Container,
  Heading,
  Text,
  Button,
  useToast,
  Textarea,
  Flex,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  Center,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import {
  useContract,
  useOwnedNFTs,
  useAddress,
  ConnectWallet,
  useSigner,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { CHARITY_NFT_COLLECTION_ADDRESS } from "../../const/addresses";
import CharityNFTGrid from "../../components_new/NFTGrids/charity_NFTGrid";
import charityNFTAbi from "../../charityNFTAbi.json";
import NextLink from 'next/link';
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const MotionLinkButton = motion(
  React.forwardRef<HTMLButtonElement, any>((props, ref) => (
    <Button
      as={NextLink}
      ref={ref}
      {...props}
    />
  ))
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      duration: 0.6,
      ease: "easeOut"
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    },
  },
};

const CharityBuyPage = () => {
  const [isMintingModalOpen, setIsMintingModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const toast = useToast();
  const router = useRouter();
  const address = useAddress();
  const signer = useSigner();

  const { contract: charityCollection } = useContract(CHARITY_NFT_COLLECTION_ADDRESS);

  const { data: charityNFTs, isLoading: loadingCharityNfts } = useOwnedNFTs(
    charityCollection,
    address
  );

  const mintNFTWithMetadata = async () => {
    if (!signer) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const contract = new ethers.Contract(
        CHARITY_NFT_COLLECTION_ADDRESS,
        charityNFTAbi,
        signer
      );

      const amountInWei = ethers.utils.parseEther(paymentAmount);

      const tx = await contract.mint(amountInWei);
      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      console.log("Mint confirmed!");

      toast({
        title: "Mint Successful!",
        description: "Your Charity NFT has been minted with daily donation amount set.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setIsMintingModalOpen(false);
      setPaymentAmount("");
    } catch (err) {
      console.error("Mint failed:", err);
      toast({
        title: "Mint Failed",
        description: err instanceof Error ? err.message : "Transaction failed",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!address) {
    return (
      <Container maxW={"1200px"} p={5}>
        <Alert status="warning" borderRadius="md" mb={5}>
          <AlertIcon />
          You have to login or sign in to donate money
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
            Transform Giving with NFT Donations
          </Heading>
          <Text
            as={motion.p}
            variants={itemVariants}
            fontSize={{ base: 'lg', md: 'xl' }}
            color="whiteAlpha.800"
            maxW="800px"
          >
            Charity-powered NFTs that make supporting causes simple, transparent, and rewarding
          </Text>
        </VStack>

        <Center mb={12}>
          <Box
            bg="whiteAlpha.100"
            backdropFilter="blur(10px)"
            borderRadius="2xl"
            p={8}
            maxW="1000px"
            border="1px solid"
            borderColor="whiteAlpha.300"
            as={motion.div}
            variants={itemVariants}
          >
            <VStack spacing={6} textAlign="center">
              <Heading size="lg" color="white">
                Want to Launch Your Own Charity NFTs?
              </Heading>
              <Text color="whiteAlpha.800">
                Easily release NFTs tied to your mission. Whether you're a nonprofit, a community leader, or an individual with a cause, our platform lets you mint, manage, and track donations—no code required.
                Build trust, grow your supporter base, and create lasting impact through Web3 technology.
              </Text>
            </VStack>
            <Flex alignItems="center" justifyContent="center" marginTop={"2rem"} marginBottom={"-7"}>
              <Box flex={1} maxW="200px">
                <ConnectWallet />
              </Box>
              <Button
                colorScheme="green"
                onClick={() => setIsMintingModalOpen(true)}
                isDisabled={!address}
              >
                Mint NFT
              </Button>
            </Flex>
            <Container maxW="1200px" p={5}>
              <Modal isOpen={isMintingModalOpen} onClose={() => setIsMintingModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Mint Charity NFT</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Text mb={4}>Input the daily payment amount:</Text>
                    <Textarea
                      placeholder="Enter amount (in ETH)"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      mb={4}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      colorScheme="green"
                      onClick={mintNFTWithMetadata}
                      isDisabled={!paymentAmount}
                      width="100%"
                    >
                      Confirm Mint
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Container>
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
          {/* <Heading size="md" mb={4}>Your Charity NFTs</Heading>
          <Text mb={6}>Manage your charity NFTs.</Text> */}
          <CharityNFTGrid
            data={charityNFTs}
            isLoading={loadingCharityNfts}
            emptyText={"You do not own any NFTs yet from charity collection"}
          />
        </Box>

        <Center mt={12}>
          <Box textAlign="center" maxW="800px">
            <Heading size="lg" color="white" mb={4}>
              Ready to Give with Purpose or Lead a Cause?
            </Heading>
            <Text fontSize="xl" color="whiteAlpha.800" mb={6}>
              Subscribe, support, or start your own NFT donation journey today.
            </Text>
          </Box>
        </Center>

      </Container>

    </Box>
  );
};

export default CharityBuyPage;