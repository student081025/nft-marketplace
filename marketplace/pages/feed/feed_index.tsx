import { useAddress } from "@thirdweb-dev/react";
import styles from "../../styles/Home.module.css";
import { NextPage } from "next";
import UserStatus from "../../components_new/feed/user-status";
import StatusEvents from "../../components_new/feed/statusEvents";
import { useEffect, useState } from "react";
import { keyframes } from "@emotion/react";
import { motion } from "framer-motion";
import {
  Container,
  Heading,
  Text,
  Box,
  Flex,
  VStack,
  Spacer,
} from "@chakra-ui/react";

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

const Home: NextPage = () => {
  const address = useAddress();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Box minH="100vh" />;
  }

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, #0F4C75, #3282B8, #BBE1FA)"
      css={{
        backgroundSize: "400% 400%",
        animation: `${gradient} 15s ease infinite`,
      }}
      py={10}
    >
      <Container maxW="container.lg" mb={10}>
        <VStack
          spacing={6}
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          textAlign="center"
        >
          <Heading
            as={motion.h1}
            variants={itemVariants}
            fontSize={{ base: "3xl", md: "5xl" }}
            color="whiteAlpha.900"
            fontWeight="extrabold"
          >
            Stay in the Loop
          </Heading>
          <Text
            as={motion.p}
            variants={itemVariants}
            fontSize={{ base: "md", md: "lg" }}
            color="whiteAlpha.800"
            maxW="3xl"
          >
            Discover the latest posts from fellow members, supporters, and
            creators. Whether it’s a new NFT drop, a milestone donation, or
            behind-the-scenes moments—this is where the action happens. Join the
            conversation, celebrate impact, and stay connected in real time.
          </Text>
        </VStack>
      </Container>


      <Flex justify="center">
        <Box
          as={motion.div}
          variants={itemVariants}
          bg="white"
          backdropFilter="blur(10px)"
          borderRadius="3xl"
          p={6}
          border="1px solid"
          borderColor="whiteAlpha.800"
          width={{ base: "90%", md: "1200px", lg: "1200px" }}
          marginBottom={"2rem"}
        >
              <div style={{ marginBottom: '1rem' }}>
                <UserStatus />
              </div>
              <div style={{ padding: '0 2rem' }}>
                <h3 style={{ textAlign: 'left', fontSize: '1.5rem', marginBottom: '1rem' }}>Status Feed:</h3>
              </div>
              <StatusEvents />

        </Box>
      </Flex>
    </Box>
  );
};

export default Home;
