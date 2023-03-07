import React, { useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import { useRouter } from "next/router";

type SearchInputProps = {
  user?: User | null;
};

const SearchInput: React.FC<SearchInputProps> = ({ user }) => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    router.push(`/results?q=${query}`);
  };

  return (
    <Flex flexGrow={1} mr={3} maxWidth="600px" align="center">
      <form onSubmit={handleSubmit}>
        <InputGroup>
          <Input
            placeholder="Search"
            variant="filled"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <InputRightElement position="absolute" top="-3px" right="3px">
            <Button variant="ghost" type="submit">
              <SearchIcon color="gray.400" />
            </Button>
          </InputRightElement>
        </InputGroup>
      </form>
    </Flex>
  );
};
export default SearchInput;
