import {useEffect, useState} from 'react';
import {supabase} from '../lib/supabase';
import {
    Box,
    Center,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading,
    Image,
    Input, NumberDecrementStepper, NumberIncrementStepper,
    NumberInput,
    NumberInputField, NumberInputStepper,
    RangeSlider,
    RangeSliderFilledTrack,
    RangeSliderMark,
    RangeSliderThumb,
    RangeSliderTrack,
    Select,
    Text,
    Textarea,
    useToast,
} from '@chakra-ui/react';
import {useUserStore} from '../state/useUserStore';
import {Genre} from '../lib/enum';
import {useRouter} from 'next/router';

/*
Info needed:
- Title
- Author
- Genre
- Age Range
- Rating
- Image

- Summary
- Recommendation reasons
- Favorite parts
 */

// TODO: add characters

const LinkedInput = ({stateVar, setStateVar, ...props}) => {
    return (
        <Input {...props} value={stateVar} onChange={(e) => setStateVar(e.target.value)}/>
    );
};

const LinkedTextarea = ({stateVar, setStateVar, ...props}) => {
    return (
        <Textarea {...props} value={stateVar} onChange={(e) => setStateVar(e.target.value)}/>
    );
};

const FileUpload = ({...props}) => {
    return (
        <Input
            type="file"
            sx={{
                '::file-selector-button': {
                    height: 10,
                    padding: 0,
                    mr: 4,
                    background: 'none',
                    border: 'none',
                    fontWeight: 'bold',
                },
            }}
            accept={'image/*'}
            {...props}
        />
    );
};

const genUuid = () => ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
);

const MakeRecommendation = () => {
    const {user} = useUserStore();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('Fiction');
    const [age, setAge] = useState(12);
    const [rating, setRating] = useState(5);
    const [image, setImage] = useState('');
    const [summary, setSummary] = useState('');
    const [reasons, setReasons] = useState('');
    const [favoriteParts, setFavoriteParts] = useState('');
    const toast = useToast();
    const router = useRouter();
    const toastError = (msg) => {
        toast({
            title: 'Error',
            description: msg,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    };
    const onSubmitRecommendation = async () => {
        // validate if any are empty
        if (!title || !author || !genre || !age || !rating || !image || !summary || !reasons || !favoriteParts) {
            toastError('Please fill out all fields.');
            return;
        }
        // validate lengths
        if (title.length > 100) {
            toastError('Title must be less than 100 characters.');
            return;
        }
        if (author.length > 100) {
            toastError('Author must be less than 100 characters.');
            return;
        }
        if (summary.length < 200) {
            toastError('Summary must be more than 200 characters.');
            return;
        }
        if (reasons.length < 100) {
            toastError('Recommendation reasons must be more than 100 characters.');
            return;
        }
        if (favoriteParts.length < 80) {
            toastError('Favorite parts must be more than 80 characters.');
            return;
        }
        // upload image to supabase
        const {
            data,
            error,
        } = await supabase.storage.from('book-images').upload(`public/${user.id}/${genUuid()}_${image.name}`, image);
        if (error) {
            toastError('Error uploading image.');
            console.error(error);
            return;
        }
        const {data: imageurl} = supabase
            .storage
            .from('book-images')
            .getPublicUrl(data.path);

        // insert recommendation into db
        const {error: recommendationError} = await supabase
            .from('books')
            .insert({
                title,
                author,
                genre,
                age,
                rating,
                image: imageurl.publicUrl,
                summary,
                recommendation_reasons: reasons,
                favorite_parts: favoriteParts,
                user_id: user.id,
            });
        if (recommendationError) {
            toastError('Error submitting recommendation.');
            console.error(recommendationError);
            return;
        }
        toast({
            title: 'Success',
            description: 'Your recommendation has been submitted!',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        router.push(`/recommendations`);
    };
    return (
        <Flex alignItems={'center'} flexDir={'column'} w={'100%'}>
            <Center py={10}>
                <Text as="h1" fontSize={'5xl'}>Make a Recommendation</Text>
            </Center>
            {!user ? <Text>You must be logged in to make a recommendation.</Text> : (
                <Center w={'60%'} flexDir={'column'} gap={4} pb={8}>
                    <Heading as="h2" size="lg">Book Info</Heading>
                    <FormControl>
                        <FormLabel>Book name</FormLabel>
                        <LinkedInput stateVar={title} setStateVar={setTitle}/>
                        <FormHelperText>Make sure to capitalize!</FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Author</FormLabel>
                        <LinkedInput stateVar={author} setStateVar={setAuthor}/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Genre</FormLabel>
                        <Select placeholder="Select genre" value={genre}
                                onChange={(g) => setGenre(g.target.value)}>
                            {Object.values(Genre).map((genre) => (
                                <option key={genre} value={genre}>
                                    {genre}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Age</FormLabel>
                        <NumberInput min={3} max={32}
                                     defaultValue={12}>
                            <NumberInputField value={age} onChange={(e) => setAge(e.target.value)}/>
                            <NumberInputStepper>
                                <NumberIncrementStepper/>
                                <NumberDecrementStepper/>
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Image</FormLabel>
                        <FileUpload onChange={(e) => setImage(e.target.files[0])}/>
                    </FormControl>
                    <Heading pt={8} as="h2" size="lg">Your Recommendation</Heading>
                    <FormControl>
                        <FormLabel>Summary</FormLabel>
                        <LinkedTextarea stateVar={summary} setStateVar={setSummary}/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Recommendation Reasons</FormLabel>
                        <LinkedTextarea stateVar={reasons} setStateVar={setReasons}/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Favorite Parts</FormLabel>
                        <LinkedTextarea stateVar={favoriteParts} setStateVar={setFavoriteParts}/>
                        <FormHelperText>No spoilers!</FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Rating</FormLabel>
                        <RangeSlider aria-label={['min', 'max']} defaultValue={[rating]} min={1} max={5}
                                     step={0.5}
                                     onChangeEnd={(v) => setRating(v)}>
                            {new Array(5).fill('').map((_, i) => (
                                <RangeSliderMark key={i} value={1 + i}>
                                    <Text fontSize={'sm'}>{1 + i}</Text>
                                </RangeSliderMark>
                            ))}
                            <RangeSliderThumb index={0}/>
                            <RangeSliderTrack>
                                <RangeSliderFilledTrack/>
                            </RangeSliderTrack>
                        </RangeSlider>
                    </FormControl>
                    <Center>
                        <Box
                            as="button"
                            bg="blue.500"
                            color="white"
                            px={4}
                            py={2}
                            rounded="md"
                            _hover={{
                                bg: 'blue.600',
                            }}
                            _active={{
                                bg: 'blue.700',
                                transform: 'scale(0.95)',
                            }}
                            onClick={onSubmitRecommendation}
                        >
                            Submit
                        </Box>
                    </Center>
                </Center>
            )}
        </Flex>
    );
};

export default MakeRecommendation;
