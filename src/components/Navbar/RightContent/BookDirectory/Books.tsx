import { Box, Flex, Icon, MenuItem, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import CreateBookModal from "../../../Modal/CreateBook/CreateBookModal";
import { IoMdAdd } from "react-icons/io";
import { useRecoilValue } from "recoil";
import MenuListItem from "./MenuListItem";
import { FaReddit } from "react-icons/fa";
import { bookState } from "@/atoms/booksAtom";
import { BsBook } from "react-icons/bs";

type BooksProps = {};

const Books: React.FC<BooksProps> = () => {
  const [open, setOpen] = useState(false);
  const mySnippets = useRecoilValue(bookState).mySnippets;

  return (
    <>
      <CreateBookModal open={open} handleClose={() => setOpen(false)} />
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MODERATING
        </Text>
        {mySnippets
          .filter((snippet) => snippet.isModerator)
          .map((snippet) => (
            <MenuListItem
              key={snippet.bookId}
              icon={BsBook}
              displayText={snippet.title}
              link={`/${snippet.bookId}`}
              iconColor="yellow.500"
              imageURL={snippet.imageURL}
            />
          ))}
      </Box>
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MY BOOKS
        </Text>
        <MenuItem
          width="100%"
          fontSize="10pt"
          bg="gray.800"
          _hover={{ bg: "gray.700" }}
          onClick={() => setOpen(true)}
        >
          <Flex align="center">
            <Icon fontSize={20} mr={2} as={IoMdAdd} color="white" />
            Create Book
          </Flex>
        </MenuItem>
        {mySnippets
          .filter((snippet) => !snippet.isModerator)
          .map((snippet) => (
            <MenuListItem
              key={snippet.bookId}
              icon={BsBook}
              displayText={snippet.title}
              link={`/${snippet.bookId}`}
              iconColor="yellow.500"
              imageURL={snippet.imageURL}
            />
          ))}
      </Box>
    </>
  );
};
export default Books;
