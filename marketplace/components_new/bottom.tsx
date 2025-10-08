import { Avatar, Box, Flex, Heading, Link, Text, Stack } from "@chakra-ui/react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import NextLink from 'next/link';

export function BottomBar() {
    const address = useAddress();

    return (
        <Box
            position={"fixed"}
            bottom={0}
            width={"100%"}
            bg="rgba(255, 255, 255, 0.8)"
            color={"gray.800"}
            backdropFilter="blur(10px)"
            borderTop={"1px solid"}
            borderColor={"gray.100"}
            py={"10px"}
            px={"40px"}
            boxShadow="sm"
            zIndex={500}
        >
            <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Stack direction={"row"} spacing={"4"}>
                    <Link as={NextLink} href='/references' mx={2.5}>
                        <Text>References</Text>
                    </Link>
                    <Link as={NextLink} href='/about' mx={2.5}>
                        <Text>About us</Text>
                    </Link>
                </Stack>
                <Flex>
                    <Text fontWeight="medium">Moscow, 2025</Text>
                </Flex>
            </Flex>
        </Box>
    )
}

