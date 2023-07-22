import {
    Avatar,
    Box,
    Button,
    Center,
    Flex,
    Grid,
    Heading,
    HStack,
    Icon,
    Image,
    ListItem,
    Stack,
    Text,
    UnorderedList,
    VStack,
} from '@chakra-ui/react';
import { FaTheaterMasks } from 'react-icons/fa';
import { MdChildFriendly } from 'react-icons/md';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../state/useUserStore';
import { LinkedTextarea } from '../../components/LinkedInput';
import { useState } from 'react';

const Stars = ({ rating }) => {
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

const Book = ({ book, characters, comments: commentsRaw }) => {
    console.log(commentsRaw);
    const { user } = useUserStore();
    const [comments, setComments] = useState(commentsRaw || []);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const addComment = async () => {
        if (!user) return;
        setIsSubmitting(true);
        const { data: commentData, error } = await supabase.from('comments').insert({
            book_id: book.id,
            text: comment,
            user_id: user.id,
        }).select('*').single();
        if (error) {
            console.error(error);
            setIsSubmitting(false);
            return;
        }
        setComment('');
        setIsSubmitting(false);
        setComments([
            commentData,
            ...comments,
        ]);
    };
    return !book ? (
        <Center>
            <Text>Book not found</Text>
        </Center>
    ) : (
        <Flex flexDir={'column'}>
            <Grid
                templateColumns={{
                    md: 'repeat(2, 1fr)',
                }}
                gap={4}
                w={'80%'}
                alignSelf={'center'}
                py={8}
            >
                <Image
                    src={book.image}
                    alt={'Book cover'}
                    objectFit={'contain'}
                    h={'85vh'}
                    justifySelf={'center'}
                />
                <Center flexDir={'column'}>
                    <Heading>{book.title}</Heading>
                    <Text fontSize={'2xl'} pb={4}>
                        By: {book.author}
                    </Text>
                    <Text fontSize={'xl'} style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                        {book.summary}
                    </Text>
                    <Stack
                        direction={{ base: 'column', md: 'row' }}
                        mt={10}
                        w={'100%'}
                        justifyContent={'space-evenly'}
                        alignItems={{ base: 'center', md: 'flex-start' }}
                        boxShadow={'xs'}
                        p={'6'}
                        rounded={'md'}
                    >
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
            <Box
                py={8}
                display={'flex'}
                flexDir={'column'}
                gap={4}
                width={'50%'}
                alignSelf={'center'}
            >
                <Text fontSize={'2xl'}>Characters</Text>
                <UnorderedList display={'flex'} flexDir={'column'} gap={4}>
                    {characters.map((character, i) => (
                        <Box key={i}>
                            <ListItem>
                                {character.name}
                                <Text
                                    fontSize={'md'}
                                    opacity={0.7}
                                    style={{ whiteSpace: 'pre-wrap' }}
                                >
                                    {character.description}
                                </Text>
                            </ListItem>
                        </Box>
                    ))}
                </UnorderedList>
            </Box>
            <Box
                py={8}
                display={'flex'}
                flexDir={'column'}
                gap={4}
                width={'60%'}
                alignSelf={'center'}
            >
                <Text fontSize={'2xl'}>More info</Text>
                <Box>
                    <Text fontSize={'xl'} style={{ whiteSpace: 'pre-wrap' }}>
                        Recommendation reasons:
                    </Text>
                    {book.recommendation_reasons}
                </Box>
                <Box>
                    <Text fontSize={'xl'} style={{ whiteSpace: 'pre-wrap' }}>
                        Favorite parts:
                    </Text>
                    {book.favorite_parts}
                </Box>
                <Text fontSize={'md'}>
                    Created on {new Date(book.created_at).toDateString()}
                </Text>
            </Box>
            <Box
                py={8}
                display={'flex'}
                flexDir={'column'}
                gap={4}
                width={'60%'}
                alignSelf={'center'}
            >
                <Text fontSize={'2xl'} alignSelf={'center'}>
                    Comments
                </Text>
                {user ? (
                    <HStack>
                        <LinkedTextarea stateVar={comment} setStateVar={setComment}/>
                        <Button onClick={addComment} isLoading={isSubmitting}>
                            Add Comment
                        </Button>
                    </HStack>
                ) : (
                    <Button>
                        <a href={'/login'}>Login to comment</a>
                    </Button>
                )}
                {comments.length ? (
                    <VStack>
                        {comments.map((comment) => (
                            <Box
                                key={comment.id}
                                display={'flex'}
                                flexDir={'column'}
                                gap={4}
                                boxShadow={'xs'}
                                p={'6'}
                                rounded={'md'}
                                w={'100%'}
                            >
                                <HStack>
                                    <Avatar h={8} w={8}/>
                                    <Text fontSize={'xl'} alignSelf={'center'}>
                                        Billy Bob Joe
                                    </Text>
                                </HStack>
                                <Text fontSize={'md'} opacity={0.7}>
                                    Posted on {new Date(comment.created_at).toDateString()}
                                </Text>
                                <Text>{comment.text}</Text>
                            </Box>
                        ))}
                    </VStack>
                ) : (
                    <Text>No comments yet</Text>
                )}
            </Box>
        </Flex>
    );
};

export const getServerSideProps = async (context) => {
    const { id } = context.query;
    const { data: book, error } = await supabase
        .from('books')
        .select()
        .eq('id', id)
        .maybeSingle();
    if (!book) {
        return {
            notFound: true,
        };
    }
    const { data: characters, error: error2 } = await supabase
        .from('characters')
        .select()
        .eq('book_id', id);
    const { data: comments, error: error3 } = await supabase
        .from('comments')
        .select()
        .order('created_at', { ascending: false })
        .eq('book_id', id);
    return {
        props: {
            book: JSON.parse(JSON.stringify(book)),
            characters: JSON.parse(JSON.stringify(characters)),
            comments: JSON.parse(JSON.stringify(comments)),
        },
    };
};

export default Book;
