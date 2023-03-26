import '@fontsource/inter/600.css';
import {ChakraProvider, Flex, Spacer} from '@chakra-ui/react';
import {Navbar} from '../components/Navbar';
import {Footer} from '../components/Footer';

function MyApp({Component, pageProps}) {
    return (
        <ChakraProvider>
            <Flex flexDir={'column'} minHeight={'100vh'}>
                <Navbar />
                <Component {...pageProps} />
                <Spacer />
                <Footer />
            </Flex>
        </ChakraProvider>
    );
}

export default MyApp;
