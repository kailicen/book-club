import React from "react";
import { SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { User } from "firebase/auth";

type SearchInputProps = {
  user?: User | null;
};

const SearchInput: React.FC<SearchInputProps> = ({ user }) => {
  return (
    <Flex flexGrow={1} maxWidth="600px" mr={2} align="center">
      <InputGroup>
        <Input placeholder="Search" variant="filled" />
        <InputRightElement position="absolute" top="-3px" right="3px">
          <Button variant="ghost" type="submit">
            <SearchIcon color="gray.400" />
          </Button>
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};
export default SearchInput;
