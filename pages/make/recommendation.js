import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Button,
    Center,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading,
    IconButton,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    RangeSlider,
    RangeSliderFilledTrack,
    RangeSliderMark,
    RangeSliderThumb,
    RangeSliderTrack,
    Select,
    Text,
    useToast,
} from '@chakra-ui/react';
import { useUserStore } from '../../state/useUserStore';
import { Genre } from '../../lib/enum';
import { useRouter } from 'next/router';
import { FaTrash } from 'react-icons/fa';
import { LinkedInput, LinkedTextarea } from '../../components/LinkedInput';
import { FileUpload } from '../../components/FileUpload';
import { genUuid } from '../../lib/uuid';

/*
Info needed:
- Title
- Author
- Genre
- Age Range
- Rating
- Image
- Characters

- Summary
- Recommendation reasons
- Favorite parts
 */

const MakeRecommendation = () => {
    const { user } = useUserStore();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('Fiction');
    const [age, setAge] = useState(12);
    const [rating, setRating] = useState(5);
    const [image, setImage] = useState('');
    const [summary, setSummary] = useState('');
    const [reasons, setReasons] = useState('');
    const [favoriteParts, setFavoriteParts] = useState('');
    const [characters, setCharacters] = useState([
        {
            name: '',
            description: '',
        },
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        if (
            !title ||
            !author ||
            !genre ||
            !age ||
            !rating ||
            !image ||
            !summary ||
            !reasons ||
            !favoriteParts
        ) {
            toastError('Please fill out all fields.');
            return;
        }
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
            toastError(
                'Recommendation reasons must be more than 100 characters.',
            );
            return;
        }
        if (favoriteParts.length < 80) {
            toastError('Favorite parts must be more than 80 characters.');
            return;
        }
        if (characters.length < 1) {
            toastError('You must add at least one character.');
            return;
        }
        if (characters.length > 8) {
            toastError('You can have at max eight characters.');
            return;
        }
        for (const char of characters) {
            if (!char.name || !char.description) {
                toastError(
                    'One or more of your characters are missing a name or description.',
                );
                return;
            }
        }
        setIsSubmitting(true);
        // upload image to supabase
        const { data, error } = await supabase.storage
            .from('book-images')
            .upload(`public/${user.id}/${genUuid()}_${image.name}`, image);
        if (error) {
            toastError('Error uploading image.');
            console.error(error);
            return;
        }
        const { data: imageurl } = supabase.storage
            .from('book-images')
            .getPublicUrl(data.path);

        // insert recommendation into db
        const {
            data: { id: recId },
            error: recommendationError,
        } = await supabase
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
            })
            .select('id')
            .maybeSingle();
        if (recommendationError) {
            toastError('Error submitting recommendation.');
            console.error(recommendationError);
            return;
        }
        // insert characters into db
        const { error: characterError } = await supabase
            .from('characters')
            .insert(
                characters.map((c) => ({
                    book_id: recId,
                    name: c.name,
                    description: c.description,
                })),
            );
        if (characterError) {
            toastError('Error submitting characters.');
            console.error(characterError);
            return;
        }
        setIsSubmitting(false);
        toast({
            title: 'Success',
            description: 'Your recommendation has been submitted!',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        router.push(`/book/${recId}`);
    };
    return (
        <Flex alignItems={'center'} flexDir={'column'} w={'100%'}>
            <Center py={10}>
                <Text as="h1" fontSize={'5xl'}>
                    Make a Recommendation
                </Text>
            </Center>
            {!user ? (
                <Text>You must be logged in to make a recommendation.</Text>
            ) : (
                <Center w={'60%'} flexDir={'column'} gap={4} pb={8}>
                    <Heading as="h2" size="lg">
                        Book Info
                    </Heading>
                    <FormControl>
                        <FormLabel>Book name</FormLabel>
                        <LinkedInput stateVar={title} setStateVar={setTitle}/>
                        <FormHelperText>
                            Make sure to capitalize!
                        </FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Author</FormLabel>
                        <LinkedInput
                            stateVar={author}
                            setStateVar={setAuthor}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Genre</FormLabel>
                        <Select
                            placeholder="Select genre"
                            value={genre}
                            onChange={(g) => setGenre(g.target.value)}
                        >
                            {Object.values(Genre).map((genre) => (
                                <option key={genre} value={genre}>
                                    {genre}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Age</FormLabel>
                        <NumberInput min={3} max={32} defaultValue={12}>
                            <NumberInputField
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                            <NumberInputStepper>
                                <NumberIncrementStepper/>
                                <NumberDecrementStepper/>
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Image</FormLabel>
                        <FileUpload
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </FormControl>
                    <Heading pt={8} as="h2" size="lg">
                        Characters
                    </Heading>
                    <Button
                        onClick={() =>
                            setCharacters((prevChars) => [
                                ...prevChars,
                                {
                                    name: '',
                                    description: '',
                                },
                            ])
                        }
                    >
                        Add a character
                    </Button>
                    {characters.map(({ name, description }, i) => (
                        <Flex gap={4} w={'100%'} key={i}>
                            <Input
                                w={'30%'}
                                placeholder="Character name"
                                value={name}
                                onChange={(e) => {
                                    setCharacters(
                                        characters.map((char, j) => {
                                            if (j !== i) return char;
                                            char.name = e.target.value;
                                            return char;
                                        }),
                                    );
                                }}
                            />
                            <Input
                                placeholder="Short description / summary"
                                value={description}
                                onChange={(e) => {
                                    setCharacters(
                                        characters.map((char, j) => {
                                            if (j !== i) return char;
                                            char.description = e.target.value;
                                            return char;
                                        }),
                                    );
                                }}
                            />
                            <IconButton
                                icon={<FaTrash/>}
                                onClick={() =>
                                    setCharacters(
                                        characters.filter((_, j) => j !== i),
                                    )
                                }
                            />
                        </Flex>
                    ))}
                    <Heading pt={8} as="h2" size="lg">
                        Your Recommendation
                    </Heading>
                    <FormControl>
                        <FormLabel>Summary</FormLabel>
                        <LinkedTextarea
                            stateVar={summary}
                            setStateVar={setSummary}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Recommendation Reasons</FormLabel>
                        <LinkedTextarea
                            stateVar={reasons}
                            setStateVar={setReasons}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Favorite Parts</FormLabel>
                        <LinkedTextarea
                            stateVar={favoriteParts}
                            setStateVar={setFavoriteParts}
                        />
                        <FormHelperText>No spoilers!</FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Rating</FormLabel>
                        <RangeSlider
                            aria-label={['min', 'max']}
                            defaultValue={[rating]}
                            min={1}
                            max={5}
                            step={0.5}
                            onChangeEnd={(v) => setRating(v)}
                        >
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
                        <Button
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
                            isLoading={isSubmitting}
                        >
                            Submit
                        </Button>
                    </Center>
                </Center>
            )}
        </Flex>
    );
};

export default MakeRecommendation;
