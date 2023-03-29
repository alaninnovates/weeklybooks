import {
    Box,
    Button,
    Center,
    Flex,
    Grid,
    Heading, IconButton,
    Image,
    Input, LinkBox,
    RangeSlider, RangeSliderFilledTrack, RangeSliderMark, RangeSliderThumb, RangeSliderTrack, Select,
    SimpleGrid,
    Text, Tooltip, useToast, Link,
} from '@chakra-ui/react';
import {forwardRef, useState} from 'react';
import {Genre} from '../lib/enum';
import {supabase} from '../lib/supabase';
import {useUserStore} from '../state/useUserStore';
import {FaPlus} from 'react-icons/fa';

const MakeRecommendationButton = forwardRef(function ChakraLinkButton(props, ref) {
    return (
        <Tooltip label={'Make a recommendation'}>
            <Link display={'block'} ref={ref} href={'/make-recommendation'} {...props}>
                <IconButton
                    as={'a'}
                    colorScheme={'green'}
                    size={'lg'}
                    icon={<FaPlus/>}
                    rounded={'full'}
                    aria-label={'Make a recommendation'}>
                </IconButton>
            </Link>
        </Tooltip>
    );
});

const Recommendations = ({books: b}) => {
    const user = useUserStore(state => state.user);
    const [books, setBooks] = useState(b);
    const [queryIsLoading, setQueryIsLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [customEnabled, setCustomEnabled] = useState(false);
    const [ageRange, setAgeRange] = useState([8, 12]);
    const [genre, setGenre] = useState('Fiction');
    const [ratingRange, setRatingRange] = useState([3, 5]);

    const toast = useToast();

    const toastError = (msg) => {
        toast({
            title: 'Error',
            description: msg,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    };

    const searchBooks = async () => {
        setQueryIsLoading(true);
        if (!search) {
            toastError('Please enter a search term');
            setQueryIsLoading(false);
            return;
        } else if (search.length < 3) {
            toastError('Please enter a longer search term');
            setQueryIsLoading(false);
            return;
        }
        const {data, error} = await supabase.from('books').select()
            .ilike('title', `%${search}%`)
            .gte('age', ageRange[0])
            .lte('age', ageRange[1])
            .gte('rating', ratingRange[0])
            .lte('rating', ratingRange[1])
            .eq('genre', genre);
        setBooks(data);
        setQueryIsLoading(false);
    };

    return (
        <Box>
            {user && (
                <MakeRecommendationButton position={'fixed'} bottom={10} right={10}/>
            )}
            <Center py={10}>
                <Text as="h1" fontSize={'5xl'}>Recommendations</Text>
            </Center>
            <Center>
                <Flex w={'70%'}>
                    <Button
                        onClick={() => {
                            setBooks(b);
                            setSearch('');
                            setCustomEnabled(false);
                            setAgeRange([8, 12]);
                            setGenre('Fiction');
                            setRatingRange([3, 5]);
                        }}
                        colorScheme={'red'}
                        mr={4}
                        size={'lg'}
                    >
                        Reset
                    </Button>
                    <Input placeholder="Search for a book" size="lg" value={search}
                           onChange={(e) => setSearch(e.target.value)}/>
                    <Button ml={4} size="lg" colorScheme="green" onClick={searchBooks}
                            isLoading={queryIsLoading}>Search</Button>
                    <Button ml={4} size="lg" colorScheme="teal" onClick={() => setCustomEnabled(c => !c)}>Custom
                        Filter</Button>
                </Flex>
            </Center>
            {customEnabled && (
                <Center py={4}>
                    <Flex w={'30%'} flexDir={'column'} gap={10}>
                        <Flex flexDir={'column'}>
                            <Text>Age group</Text>
                            <RangeSlider aria-label={['min', 'max']} defaultValue={ageRange} min={4} max={32}
                                         step={2}
                                         onChangeEnd={(v) => setAgeRange(v)}>
                                {new Array(8).fill('').map((_, i) => (
                                    <RangeSliderMark key={i} value={4 + i * 4}>
                                        <Text fontSize={'sm'}>{4 + i * 4}</Text>
                                    </RangeSliderMark>
                                ))}
                                <RangeSliderThumb index={0}/>
                                <RangeSliderThumb index={1}/>
                                <RangeSliderTrack>
                                    <RangeSliderFilledTrack/>
                                </RangeSliderTrack>
                            </RangeSlider>
                        </Flex>
                        <Flex flexDir={'column'}>
                            <Text>Genre</Text>
                            <Select placeholder="Select genre" value={genre} ml={4}
                                    onChange={(g) => setGenre(g.target.value)}>
                                {Object.values(Genre).map((genre) => (
                                    <option key={genre} value={genre}>
                                        {genre}
                                    </option>
                                ))}
                            </Select>
                        </Flex>
                        <Flex flexDir={'column'}>
                            <Text>Stars</Text>
                            <RangeSlider aria-label={['min', 'max']} defaultValue={ratingRange} min={1} max={5}
                                         onChangeEnd={(r) => setRatingRange(r)}>
                                {new Array(5).fill('').map((_, i) => (
                                    <RangeSliderMark key={i} value={1 + i}>
                                        <Text fontSize={'sm'}>{1 + i}</Text>
                                    </RangeSliderMark>
                                ))}
                                <RangeSliderThumb index={0}/>
                                <RangeSliderThumb index={1}/>
                                <RangeSliderTrack>
                                    <RangeSliderFilledTrack/>
                                </RangeSliderTrack>
                            </RangeSlider>
                        </Flex>
                    </Flex>
                </Center>
            )}
            <Center pt={4}>
                {books.length ? (
                    <SimpleGrid columns={{base: 1, md: 2, lg: 4}} spacing={4} autoRows={'25rem'} w={'80%'}>
                        {books.map((book, i) => (
                            <LinkBox
                                key={i}
                                borderWidth="1px"
                                borderRadius="lg"
                                overflow="hidden"
                                m={2}
                                as={'a'}
                                href={`/book/${book.id}`}
                            >
                                <Grid
                                    templateRows="70% 30%"
                                    justifyContent="center"
                                    alignItems="center"
                                    mt={4}
                                    w={'100%'}
                                    h={'100%'}
                                >
                                    <Image src={book.image} h="100%" justifySelf={'center'} alt={'Book cover'}/>
                                    <Heading alignSelf="center" p={4}>
                                        {book.title}
                                    </Heading>
                                </Grid>
                            </LinkBox>
                        ))}
                    </SimpleGrid>
                ) : <Text fontSize={'2xl'} pt={8}>No results</Text>}
            </Center>
        </Box>
    );
};

export const getServerSideProps = async () => {
    const {data: books} = await supabase.from('books').select().order('created_at', {
        ascending: false,
    }).limit(50);
    return {
        props: {
            books: JSON.parse(JSON.stringify(books)),
        },
    };
};

export default Recommendations;
