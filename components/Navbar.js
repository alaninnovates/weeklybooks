import {
    Button,
    Flex,
    IconButton,
    Spacer,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { RxHamburgerMenu } from "react-icons/rx";
import { motion } from "framer-motion";
import { useUserStore } from "../state/useUserStore";

const NavButton = ({ name, href }) => {
    return (
        <NextLink href={href} passHref>
            <Button
                bg={"teal.200"}
                fontFamily={"Inter"}
                _hover={{ bg: "teal.100" }}
                as={"a"}
            >
                <Text fontSize={"xl"}>{name}</Text>
            </Button>
        </NextLink>
    );
};

export const Navbar = () => {
    const { user } = useUserStore();
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <header>
            <Flex backgroundColor={"gray.200"} px={8} py={3}>
                <Flex
                    display={{
                        base: "none",
                        md: "flex",
                    }}
                    w={"100%"}
                >
                    <Flex gap={4} align={"center"}>
                        <NavButton name={"Home"} href={"/"} />
                        <NavButton
                            name={"Recommendations"}
                            href={"/recommendations"}
                        />
                        <NavButton name={"Reviews"} href={"/reviews"} />
                    </Flex>
                    <Spacer />
                    <Flex align={"center"}>
                        {user ? (
                            <NavButton name={"Logout"} href={"/logout"} />
                        ) : (
                            <NavButton name={"Login"} href={"/login"} />
                        )}
                    </Flex>
                </Flex>
                <IconButton
                    aria-label="Open Menu"
                    size="lg"
                    mr={2}
                    icon={<RxHamburgerMenu />}
                    onClick={onOpen}
                    display={{
                        base: "flex",
                        md: "none",
                    }}
                />
            </Flex>
            <Flex
                w="100vw"
                display={isOpen ? "flex" : "none"}
                zIndex={20}
                pos="fixed"
                top="0"
                left="0"
                overflowY="auto"
                flexDir="column"
                backgroundColor={"gray.50"}
                px={8}
                pt={3}
                pb={10}
                gap={4}
                as={motion.div}
                layout
                style={{
                    height: isOpen ? "100vh" : "0",
                }}
            >
                <Flex>
                    <IconButton
                        aria-label="Close Menu"
                        size="lg"
                        mr={2}
                        icon={<RxHamburgerMenu />}
                        onClick={onClose}
                    />
                </Flex>
                <NavButton name={"Home"} href={"/"} />
                <NavButton name={"Recommendations"} href={"/recommendations"} />
                <NavButton name={"Reviews"} href={"/reviews"} />
                <Spacer />
                {user ? (
                    <NavButton name={"Logout"} href={"/logout"} />
                ) : (
                    <NavButton name={"Login"} href={"/login"} />
                )}
            </Flex>
        </header>
    );
};
