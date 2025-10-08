import React from 'react';
import Image from "next/image";
import { NextPage } from "next";
import NextLink from 'next/link';
import { Box, Container, Flex, Stack, Heading, Button, Text, VStack } from "@chakra-ui/react";
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

const Home: NextPage = () => {
  return (
    <Box minH="100vh"
      bgGradient="linear(to-br, #0F4C75, #3282B8, #BBE1FA)"
      css={{
        backgroundSize: '400% 400%',
        animation: `${gradient} 15s ease infinite`,
      }}
      position="relative">
      <Container maxW="container.xl"
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        <VStack
          spacing={8}
          textAlign="center"
          maxW="800px"
        >
          <Box
            as={motion.div}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src="/images/dumbbell.png"
              width={200}
              height={200}
              alt="Gym Logo"
              priority
            />
          </Box>

          <Heading
            as={motion.h1}
            variants={itemVariants}
            fontSize={{ base: '4xl', md: '6xl' }}
            color="whiteAlpha.800"
            textShadow="0 4px 30px rgba(0,0,0,0.15)"
            fontWeight="extrabold"
            lineHeight="1.2"
          >
            Gym NFT Marketplace
          </Heading>
          <Text
            as={motion.p}
            variants={itemVariants}
            fontSize={{ base: 'lg', md: 'xl' }}
            color="whiteAlpha.800"
            maxW="600px"
          >
            Buy, sell, or trade your gym memberships as NFTs in our marketplace.
          </Text>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            gap={4}
            as={motion.div}
            variants={itemVariants}
          >
            <MotionLinkButton
              href="/gym/sell"
              size="lg"
              variant="solid"
              bg="whiteAlpha.300"
              color="white"
              border="1px solid"
              borderColor="whiteAlpha.700"
              backdropFilter="blur(10px)"
              _hover={{
                bg: 'whiteAlpha.500',
                borderColor: 'whiteAlpha.900',
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sell Membership
            </MotionLinkButton>



            <MotionLinkButton
              href="/gym/buy"
              size="lg"
              variant="outline"
              color="white"
              borderColor="whiteAlpha.700"
              _hover={{
                bg: 'whiteAlpha.200',
                borderColor: 'whiteAlpha.900',
                color: 'white'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Buy Membership
            </MotionLinkButton>

          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

export default Home;
