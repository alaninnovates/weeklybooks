import {
    Avatar,
    Box,
    Center,
    Flex,
    Grid,
    Heading,
    HStack,
    Icon,
    Image,
    ListItem,
    Stack,
    Text, UnorderedList,
} from '@chakra-ui/react';
import {FaTheaterMasks} from 'react-icons/fa';
import {MdChildFriendly} from 'react-icons/md';
import {BsStarFill, BsStarHalf, BsStar} from 'react-icons/bs';
import {supabase} from '../../lib/supabase';

const Stars = ({rating}) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        if (i < Math.floor(rating)) {
            stars.push(<Icon as={BsStarFill} w={8} h={8}/>);
        } else if (i === Math.floor(rating) && rating % 1 !== 0) {
            stars.push(<Icon as={BsStarHalf} w={8} h={8}/>);
        } else {
            stars.push(<Icon as={BsStar} w={8} h={8} opacity={0.5}/>);
        }
    }
    return stars;
};

const Book = ({book, characters}) => {
    return !book ? <Center><Text>Book not found</Text></Center> : (
        <Flex flexDir={'column'}>
            <Grid templateColumns={{
                'md': 'repeat(2, 1fr)',
            }} gap={4} w={'80%'} alignSelf={'center'} py={8}>
                <Image src={book.image} alt={'Book cover'}
                       objectFit={'contain'} h={'85vh'}
                       justifySelf={'center'}/>
                <Center flexDir={'column'}>
                    <Heading>{book.title}</Heading>
                    <Text fontSize={'2xl'} pb={4}>By: {book.author}</Text>
                    <Text fontSize={'xl'}>{book.summary}</Text>
                    <Stack direction={{'base': 'column', 'md': 'row'}}
                           mt={10} w={'100%'} justifyContent={'space-evenly'}
                           alignItems={{'base': 'center', 'md': 'flex-start'}}
                           boxShadow={'xs'} p={'6'} rounded={'md'}>
                        <Center flexDir={'column'}>
                            <Text>Genre</Text>
                            <Icon as={FaTheaterMasks} w={8} h={8}/>
                            <Text fontSize={'xl'}>{book.genre}</Text>
                        </Center>
                        <Center flexDir={'column'}>
                            <Text>Reading age</Text>
                            <Icon as={MdChildFriendly} w={8} h={8}/>
                            <Text fontSize={'xl'}>{book.age}</Text>
                        </Center>
                        <Center flexDir={'column'}>
                            <Text>Reader rating</Text>
                            <HStack>
                                <Stars rating={book.rating}/>
                            </HStack>
                        </Center>
                    </Stack>
                </Center>
            </Grid>
            <Box py={8} display={'flex'} flexDir={'column'} gap={4} width={'50%'} alignSelf={'center'}>
                <Text fontSize={'2xl'}>Characters</Text>
                <UnorderedList display={'flex'} flexDir={'column'} gap={4}>
                {characters.map((character, i) => (
                    <Box key={i}>
                        <ListItem>
                            {character.name}
                            <Text fontSize={'md'} opacity={0.7}>{character.description}</Text>
                        </ListItem>
                    </Box>
                ))}
                </UnorderedList>
            </Box>
            <Box py={8} display={'flex'} flexDir={'column'} gap={4} width={'60%'} alignSelf={'center'}>
                <Text fontSize={'2xl'}>More info</Text>
                <Box>
                    <Text fontSize={'xl'}>Recommendation reasons:</Text>
                    {book.recommendation_reasons}
                </Box>
                <Box>
                    <Text fontSize={'xl'}>Favorite parts:</Text>
                    {book.favorite_parts}
                </Box>
                <Text fontSize={'md'}>Posted at {new Date(book.created_at).toLocaleString()}</Text>
            </Box>
            <Box py={8} display={'flex'} flexDir={'column'} gap={4} width={'60%'} alignSelf={'center'}>
                <Text fontSize={'2xl'} alignSelf={'center'}>Comments</Text>
                <Box display={'flex'} flexDir={'column'} gap={4}
                     boxShadow={'xs'} p={'6'} rounded={'md'}>
                    <HStack>
                        <Avatar h={8} w={8}/>
                        <Text fontSize={'xl'} alignSelf={'center'}>Billy Bob Joe</Text>
                    </HStack>
                    <Text fontSize={'md'} opacity={0.7}>Posted on {new Date().toDateString()}</Text>
                    <Text>I really liked this book</Text>
                </Box>
            </Box>
        </Flex>
    );
};

export const getServerSideProps = async (context) => {
    const {id} = context.query;
    const {data: book, error} = await supabase.from('books').select().eq('id', id).maybeSingle();
    const {data: characters, error: error2} = await supabase.from('characters').select().eq('book_id', id);
    if (!book) {
        return {
            notFound: true,
        };
    }
    return {
        props: {
            book: JSON.parse(JSON.stringify(book)),
            characters: JSON.parse(JSON.stringify(characters)),
        },
    };
};

export default Book;
