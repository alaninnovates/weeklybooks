import {useEffect} from 'react';
import {supabase} from '../lib/supabase';
import {useRouter} from 'next/router';
import {Center} from '@chakra-ui/react';

const Logout = () => {
    const router = useRouter();
    const logoutFunc = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };
    useEffect(() => {
        logoutFunc();
    }, []);
    return (
        <Center>
            <h1>Logging out...</h1>
        </Center>
    );
};

export default Logout;
