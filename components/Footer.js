import { Box, Text } from "@chakra-ui/react";

export const Footer = () => (
    <footer>
        <Box
            bg={"gray.200"}
            color={"gray.600"}
            py={4}
            px={8}
            borderTopWidth={1}
            borderColor={"gray.300"}
            textAlign={"center"}
        >
            <Text fontSize={"sm"}>© 2023 Weeklybooks. All rights reserved</Text>
            <Text fontSize={"sm"}>Made with ❤️ by Alan</Text>
        </Box>
    </footer>
);
