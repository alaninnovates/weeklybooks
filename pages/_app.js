import '@fontsource/inter/600.css';
import { ChakraProvider, Flex, Spacer } from '@chakra-ui/react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../state/useUserStore';

function MyApp({ Component, pageProps }) {
    const { setUser } = useUserStore();
    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                const { user } = session;
                setUser(user);
            } else {
                setUser(null);
            }
        });
    }, []);
    return (
        <ChakraProvider>
            <Flex flexDir={'column'} minHeight={'100vh'}>
                <Navbar/>
                <Component {...pageProps} />
                <Spacer/>
                <Footer/>
            </Flex>
        </ChakraProvider>
    );
}

export default MyApp;
