import {
    Box,
    Center,
    Flex,
    Grid,
    Heading,
    IconButton,
    Image,
    Link,
    Text,
    useBreakpointValue,
    VStack,
} from '@chakra-ui/react';
import { FaArrowRight } from 'react-icons/fa';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str;
};

const Home = ({ recommendations, reviews }) => {
    const router = useRouter();
    return (
        <Box>
            <Head>
                <title>Weeklybooks</title>
            </Head>
            <Center h={'100vh'}>
                <Flex
                    flexDirection={{
                        md: 'row',
                        base: 'column-reverse',
                    }}
                >
                    <Heading
                        fontSize={'6xl'}
                        pr={12}
                        alignSelf={'center'}
                        textAlign={'center'}
                    >
                        Bringing great reads
                        <br/>
                        to{' '}
                        <Text
                            as={'span'}
                            position={'relative'}
                            _after={{
                                content: `""`,
                                width: 'full',
                                height: useBreakpointValue({
                                    base: '20%',
                                    md: '30%',
                                }),
                                position: 'absolute',
                                bottom: 1,
                                left: 0,
                                bg: 'teal.100',
                                zIndex: -1,
                            }}
                        >
                            everyone
                        </Text>
                    </Heading>
                    <Image
                        src={'https://bit.ly/3UbxhI1'}
                        borderRadius={'lg'}
                        alt={
                            'Children and teacher reading book in front of bookshelf'
                        }
                    />
                </Flex>
            </Center>
            <Box pb={12}>
                <Heading fontSize={'5xl'} textAlign={'center'}>
                    Explore great reads
                </Heading>
                <Grid
                    templateColumns={{
                        base: 'repeat(1, 1fr)',
                        md: 'repeat(6, 1fr)',
                    }}
                    templateRows={{
                        base: 'repeat(2, 1fr)',
                        md: 'repeat(1, 1fr)',
                    }}
                    px={10}
                    py={10}
                    h={{ base: '100vh', md: '50vh' }}
                >
                    {recommendations.map(({ image, id }, i) => (
                        <Link key={i} href={`/book/${id}`}>
                            <Image
                                src={image}
                                alt={''}
                                pr={4}
                                objectFit={'scale-down'} // og: contain
                                h={'100%'}
                            />
                        </Link>
                    ))}
                    <Center bg={'gray.100'}>
                        <VStack>
                            <Text fontSize={'3xl'}>Find more</Text>
                            <Link>
                                <IconButton
                                    size={'lg'}
                                    borderRadius={'full'}
                                    bg={'teal.200'}
                                    _hover={{ bg: 'teal.100' }}
                                    icon={<FaArrowRight/>}
                                    aria-label={'Find more'}
                                    onClick={() =>
                                        router.push('/recommendations')
                                    }
                                />
                            </Link>
                        </VStack>
                    </Center>
                </Grid>
            </Box>
            <Box pb={6}>
                <Heading fontSize={'5xl'} textAlign={'center'}>
                    See what others are saying
                </Heading>
                <Center>
                    <Text>Reviews coming very soon...</Text>
                    {/*
                    <SimpleGrid
                        columns={{ base: 1, md: 2 }}
                        spacing={10}
                        px={10}
                        py={10}
                    >
                        {reviews.map(({ title, review, reviewer }, i) => (
                            <Link key={i}>
                                <Box
                                    backgroundColor={"gray.200"}
                                    p={6}
                                    borderRadius={"lg"}
                                >
                                    <Heading fontSize={"xl"}>{title}</Heading>
                                    <Text>{truncate(review, 100)}</Text>
                                    <Text>- {reviewer}</Text>
                                </Box>
                            </Link>
                        ))}
                    </SimpleGrid>
                    */}
                </Center>
            </Box>
        </Box>
    );
};

export const getStaticProps = async () => {
    const { data: recommendations } = await supabase
        .from('books')
        .select()
        .limit(5);
    const reviews = new Array(6).fill({
        title: 'Nature Kingdom',
        review: 'This book describes an in depth view of the world we live in and how whatever yes then so yeah right cool',
        reviewer: 'Billy Bob Joe',
    });
    return {
        props: {
            recommendations: JSON.parse(JSON.stringify(recommendations)),
            reviews: JSON.parse(JSON.stringify(reviews)),
        },
    };
};

export default Home;
