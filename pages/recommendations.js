import {
    Box,
    Button,
    Center,
    Flex,
    Grid,
    Heading,
    Image,
    Input, LinkBox,
    RangeSlider, RangeSliderFilledTrack, RangeSliderMark, RangeSliderThumb, RangeSliderTrack, Select,
    SimpleGrid,
    Text, useToast,
} from '@chakra-ui/react';
import {useState} from 'react';
import {get} from '../lib/api';
import {Genre} from '../lib/enum';
import sql from '../lib/postgres';

const Recommendations = ({books: b}) => {
    const [books, setBooks] = useState(b);
    const [queryIsLoading, setQueryIsLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [customEnabled, setCustomEnabled] = useState(false);
    const [ageRange, setAgeRange] = useState([8, 12]);
    const [genre, setGenre] = useState('Fiction');
    const [ratingRange, setRatingRange] = useState([3, 5]);

    const toast = useToast();

    const searchBooks = async () => {
        setQueryIsLoading(true);
        const res = await get('/api/search', Object.assign({
            type: 'recommendations',
            searchQuery: search,
        }, customEnabled ? {
            ageRange,
            genre,
            ratingRange,
        } : {}));
        const resp = await res.json();
        if (res.status === 200) {
            setBooks(resp);
        } else {
            toast({
                title: 'Error',
                description: resp.error,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
        setQueryIsLoading(false);
    };

    return (
        <Box>
            <Center py={10}>
                <Text as="h1" fontSize={'5xl'}>Recommendations</Text>
            </Center>
            <Center>
                <Flex w={'50%'}>
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
                    <Input placeholder="Search for a book" size="lg" value={search} onChange={(e) => setSearch(e.target.value)}/>
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
                            <RangeSlider aria-label={['min', 'max']} defaultValue={ageRange} min={4} max={32} step={2}
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
    const books = await sql`SELECT * FROM books LIMIT 50`;
    return {
        props: {
            books: JSON.parse(JSON.stringify(books)),
        }
    }
}

export default Recommendations;
