import { useContract, useContractEvents } from '@thirdweb-dev/react';
import styles from '../../../styles/Home.module.css';
import { useRouter } from 'next/router';
import { STATUS_CONTRACT_ADDRESS } from "../../../const/addresses";
import EventCard from '../../../components_new/feed/eventCard';
import { useEffect, useState } from 'react';
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

export default function AcountFeed() {
    const router = useRouter();
    const { walletAddress } = router.query;

    const [isLoading, setIsLoading] = useState(true);

    const {
        contract
    } = useContract(STATUS_CONTRACT_ADDRESS);

    const {
        data: userEvents,
        isLoading: isUserEventsLoading,
    } = useContractEvents(
        contract,
        "StatusUpdated",
        {
            subscribe: true,
            queryFilter: {
                filters: {
                    user: walletAddress,
                }
            }
        }
    );

    const [postNum, setPostNum] = useState(3);

    function handleClick() {
        setPostNum(prevPostNum => prevPostNum + 3)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const sortedEvents = userEvents
        ? [...userEvents].sort((a, b) => {
            const timestampA = Number(a.data.timestamp);
            const timestampB = Number(b.data.timestamp);
            return timestampB - timestampA;
        })
        : null;

    if (isLoading) {
        return (
            <div className={styles.pageLoading}>
                {/* <div>
                    <Lottie
                        animationData={loadingLottie}
                        loop={true}
                    />
                </div> */}
            </div>
        );
    };

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

        <div style={{ width: "100%", maxWidth: "1400px", padding: "0 1rem", margin: "0 auto", marginLeft: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "2rem", marginRight: "3rem" }}>
                <h1 style={{ fontSize: "3rem", lineHeight: "1.15", textAlign: "left" }}>Account Feed</h1>
                <button
                    onClick={() => router.back()}
                    style={{
                        backgroundColor: "#ededed",
                        color: "black",
                        borderRadius: "5px",
                        padding: "0.5rem 1rem",
                        fontSize: "1.1rem",
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.15s ease",
                    }}
                >
                    Back
                </button>
            </div>
            <p style={{ fontSize: "1rem", textAlign: "left", marginTop: "0.5rem", marginBottom: "2rem" }}>{walletAddress}</p>
            <h3 style={{ textAlign: "left", marginBottom: "0.5rem", fontSize: "2rem" }}>Latest Updates:</h3>

            <div style={{ marginRight: "2rem", paddingBottom: '40px' }}>
                {!isUserEventsLoading && sortedEvents && (
                    <>
                        {sortedEvents.slice(0, postNum).map((event, index) => (
                            <div
                                key={index}
                                style={{
                                    backgroundColor: "#ededed",
                                    color: "white",
                                    textAlign: "left",
                                    borderRadius: "20px",
                                    padding: "1rem",
                                    marginBottom: "20px",
                                    maxWidth: "1400px",
                                    overflow: "none",
                                    border: "none",
                                    transition: "opacity 0.15s ease",
                                }}
                            >
                                <EventCard
                                    walletAddress={event.data.user}
                                    newstatus={event.data.newstatus}
                                    timeStamp={event.data.timestamp}
                                />
                            </div>
                        ))}

                        {sortedEvents.length > postNum && (
                            <div style={{ display: "flex", justifyContent: "center", margin: "0.1rem" }}>
                                <button
                                    onClick={handleClick}
                                    style={{
                                        backgroundColor: "#ededed",
                                        color: "black",
                                        borderRadius: "5px",
                                        padding: "0.75rem 1.5rem",
                                        fontSize: "1rem",
                                        border: "none",
                                        cursor: "pointer",
                                        transition: "background-color 0.15s ease",
                                        fontWeight: "400",
                                        // marginBottom: "0.3rem",
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#BDBDBD"}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#ededed"}
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
        </Box>
        </Flex>
        </Box>
    )
};