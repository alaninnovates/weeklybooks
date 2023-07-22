import { Box, Center, IconButton, Link, Text, Tooltip } from '@chakra-ui/react';
import { forwardRef } from 'react';
import { useUserStore } from '../state/useUserStore';
import { FaPlus } from 'react-icons/fa';

const MakeReviewButton = forwardRef(function ChakraLinkButton(props, ref) {
    return (
        <Tooltip label={'Submit a review'}>
            <Link display={'block'} ref={ref} href={'/make/review'} {...props}>
                <IconButton
                    as={'a'}
                    colorScheme={'blue'}
                    size={'lg'}
                    icon={<FaPlus/>}
                    rounded={'full'}
                    aria-label={'Submit a review'}
                />
            </Link>
        </Tooltip>
    );
});

const Reviews = () => {
    const user = useUserStore((state) => state.user);

    return (
        <Box>
            {/*{user && (*/}
            {/*    <MakeReviewButton position={"fixed"} bottom={10} right={10} />*/}
            {/*)}*/}
            <Center py={10} flexDir={"column"}>
                <Text as="h1" fontSize={'5xl'}>
                    Reviews
                </Text>
                <Text>Coming very soon...</Text>
            </Center>
        </Box>
    );
};

export default Reviews;
