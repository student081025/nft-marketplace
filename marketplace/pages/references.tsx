import styles from "../styles/Home.module.css";
import Image from "next/image";
import { NextPage } from "next";
import NextLink from 'next/link';
import { Container, Flex, Stack, Heading, Button, Text, Link, Box, VStack } from "@chakra-ui/react";

const Home: NextPage = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <Flex direction="column" minH="100vh">
        <Flex justify="space-between" align="center" mb={8} marginLeft={3}>
          <Heading as="h1" size="xl">
            References
          </Heading>
        </Flex>

        <VStack spacing={4} align="stretch" mb={8}>
          <Box bg="gray.50" p={4} borderRadius="md">
            <Link href="https://www.flaticon.com/free-icons/gym" isExternal color="blue.500">
              <Text fontSize="lg">Gym icons created by Freepik - Flaticon</Text>
            </Link>
          </Box>

          <Box bg="gray.50" p={4} borderRadius="md">
            <Link href="https://www.flaticon.com/free-icons/hand" isExternal color="blue.500">
              <Text fontSize="lg">Hand icons created by Freepik - Flaticon</Text>
            </Link>
          </Box>

          <Box bg="gray.50" p={4} borderRadius="md">
            <Link href="https://www.flaticon.com/free-icons/leaf" isExternal color="blue.500">
              <Text fontSize="lg">Leaf icons created by Freepik - Flaticon</Text>
            </Link>
          </Box>

          <Box bg="gray.50" p={4} borderRadius="md">
            <Link href="https://www.flaticon.com/free-icons/nft" isExternal color="blue.500">
              <Text fontSize="lg">NFT icons created by Flowicon - Flaticon</Text>
            </Link>
          </Box>

          <Box bg="gray.50" p={4} borderRadius="md">
            <Link href="https://www.flaticon.com/free-icons/commerce-and-shopping" isExternal color="blue.500">
              <Text fontSize="lg">Commerce and shopping icons created by Freepik - Flaticon</Text>
            </Link>
          </Box>
        </VStack>

        <Box mt="auto" py={4} textAlign="center">
          <Text color="gray.500">
            © {new Date().getFullYear()} Your App Name. All rights reserved.
          </Text>
        </Box>
      </Flex>
    </Container>
  );
};

export default Home;