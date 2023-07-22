import { Input } from '@chakra-ui/react';

export const FileUpload = ({ ...props }) => {
    return (
        <Input
            type="file"
            sx={{
                "::file-selector-button": {
                    height: 10,
                    padding: 0,
                    mr: 4,
                    background: "none",
                    border: "none",
                    fontWeight: "bold",
                },
            }}
            accept={"image/*"}
            {...props}
        />
    );
};
