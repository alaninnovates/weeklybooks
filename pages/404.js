import NextLink from 'next/link';
import {Link, Heading, Button, Center} from '@chakra-ui/react';

const FourOhFour = () => (
    <Center alignSelf={'center'} h={'100vh'} flexDir={'column'} gap={4}>
        <Heading>404 - Page Not Found</Heading>
        <Button>
            <Link as={NextLink} href="/">
                Go back home
            </Link>
        </Button>
    </Center>
);

export default FourOhFour;
