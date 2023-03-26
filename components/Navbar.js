import {Button, Flex, Spacer, Text} from '@chakra-ui/react';
import {useRouter} from 'next/router';

const NavButton = ({name, href}) => {
    const router = useRouter();
    return (
        <Button bg={'teal.200'} fontFamily={'Inter'} _hover={{bg: 'teal.100'}} onClick={() => router.push(href)}>
            <Text fontSize={'xl'}>{name}</Text>
        </Button>
    );
};

export const Navbar = () => {
    return (
        <header>
            <Flex backgroundColor={'gray.200'} height={'7vh'} px={8}>
                <Flex gap={4} align={'center'}>
                    <NavButton name={'Home'} href={'/'}/>
                    <NavButton name={'Recommendations'} href={'/recommendations'}/>
                    <NavButton name={'Reviews'} href={'/reviews'}/>
                </Flex>
                <Spacer/>
                <Flex align={'center'}>
                    <NavButton name={'Login'} href={'/login'}/>
                </Flex>
            </Flex>
        </header>
    );
};
