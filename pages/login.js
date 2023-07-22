import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Center } from '@chakra-ui/react';

const Login = () => {
    const loginFunc = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
    };
    useEffect(() => {
        loginFunc();
    }, []);
    return (
        <Center>
            <h1>Logging in...</h1>
        </Center>
    );
};

export default Login;
