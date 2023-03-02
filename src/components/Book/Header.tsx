import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { BsBookHalf } from "react-icons/bs";
import { Book } from "../../atoms/booksAtom";
import useBookData from "../../hooks/useBookData";

type HeaderProps = {
  bookData: Book;
};

const Header: React.FC<HeaderProps> = ({ bookData }) => {
  const { bookStateValue, onJoinOrLeaveBook, loading } = useBookData();
  const isJoined = !!bookStateValue.mySnippets.find(
    (item) => item.bookId === bookData.id
  );

  return (
    <Flex direction="column" width="100%" height="150px">
      <Box height="50%" bg="yellow.400" />
      <Flex justify="center" flexGrow={1}>
        <Flex width="95%" maxWidth="860px">
          {bookStateValue.currentBook?.imageURL ? (
            <Image
              width="66px"
              height="100px"
              src={bookStateValue.currentBook.imageURL}
              alt="book image"
              position="relative"
              top={-3}
              border="4px solid black"
            />
          ) : (
            <Flex
              position="relative"
              top={-3}
              alignItems="center"
              border="4px solid black"
              height={20}
              width="66px"
              bg="gray.800"
            >
              <Icon as={BsBookHalf} fontSize={40} color="yellow.500" ml={2.5} />
            </Flex>
          )}
          <Flex padding="10px 16px">
            <Flex direction="column" mr={6}>
              <Text fontWeight={800} fontSize={{ base: "13pt", md: "16pt" }}>
                {bookStateValue.currentBook?.title}
              </Text>
              <Text fontWeight={600} fontSize="10pt" color="gray.400">
                by {bookStateValue.currentBook?.author}
              </Text>
            </Flex>
            <Button
              variant={isJoined ? "outline" : "solid"}
              height="30px"
              pr={6}
              pl={6}
              isLoading={loading}
              onClick={() => onJoinOrLeaveBook(bookData, isJoined)}
            >
              {isJoined ? "Joined" : "Join"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Header;
