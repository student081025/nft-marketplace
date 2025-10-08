import { ConnectWallet } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { NextPage } from "next";
import NextLink from 'next/link';
import { Container, Flex, Stack, Heading, Button, Text } from "@chakra-ui/react";

const Home: NextPage = () => {
  return ( 
    <Container maxW="container.xl" py={8}><Text>This website is a part of a coursework for Faculty of Computer Science in Higher School of Economics. The project is written by DSBA students of 3rd year Galishnikova Polina, Korotkevich Aleksandra and Parshina Daria. The coursework supervisors are Yanovich Yury Aleksandrovich and Kalacheva Alisa Pavlovna.</Text></Container>
    
  ) }

export default Home;