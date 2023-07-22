import { Input, Textarea } from '@chakra-ui/react';

export const LinkedInput = ({ stateVar, setStateVar, ...props }) => {
    return (
        <Input
            {...props}
            value={stateVar}
            onChange={(e) => setStateVar(e.target.value)}
        />
    );
};

export const LinkedTextarea = ({ stateVar, setStateVar, ...props }) => {
    return (
        <Textarea
            {...props}
            value={stateVar}
            onChange={(e) => setStateVar(e.target.value)}
        />
    );
};
