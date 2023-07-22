import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Button,
    Center,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    RangeSlider,
    RangeSliderFilledTrack,
    RangeSliderMark,
    RangeSliderThumb,
    RangeSliderTrack,
    Text,
    useToast,
} from '@chakra-ui/react';
import { useUserStore } from '../../state/useUserStore';
import { useRouter } from 'next/router';
import { LinkedInput, LinkedTextarea } from '../../components/LinkedInput';
import { FileUpload } from '../../components/FileUpload';

const MakeReview = () => {
    const { user } = useUserStore();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [rating, setRating] = useState(5);
    const [image, setImage] = useState('');
    const [review, setReview] = useState('');
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
        if (!title || !author || !rating || !image || !review) {
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
        if (review.length < 200) {
            toastError('Review must be more than 200 characters.');
            return;
        }
        if (review.length > 1000) {
            toastError('Review must be less than 1k characters.');
            return;
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

        // insert review into db
        const {
            data: { id: revId },
            error: recommendationError,
        } = await supabase
            .from('books')
            .insert({
                title,
                author,
                rating,
                image: imageurl.publicUrl,
                user_id: user.id,
                // user_name: user.
            })
            .select('id')
            .maybeSingle();
        if (recommendationError) {
            toastError('Error submitting review.');
            console.error(recommendationError);
            return;
        }
        setIsSubmitting(false);
        toast({
            title: 'Success',
            description: 'Your review has been submitted!',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        router.push(`/book/${revId}`);
    };
    return (
        <Flex alignItems={'center'} flexDir={'column'} w={'100%'}>
            <Center py={10}>
                <Text as="h1" fontSize={'5xl'}>
                    Submit a Review
                </Text>
            </Center>
            {!user ? (
                <Text>You must be logged in to submit a review.</Text>
            ) : (
                <Center w={'60%'} flexDir={'column'} gap={4} pb={8}>
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
                        <FormLabel>Image</FormLabel>
                        <FileUpload
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Your Review</FormLabel>
                        <LinkedTextarea
                            stateVar={review}
                            setStateVar={setReview}
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

export default MakeReview;
